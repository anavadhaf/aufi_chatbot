import axios from "axios";
import { refreshAccessToken } from "./auth.service";
import { useAuthStore } from "../store/auth.store";
import { showToast } from "../utils/toast";

export const api = axios.create();

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const { refreshToken, updateTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      logout();
      showToast({
        title: "Session Expired",
        description: "Please login again to continue.",
        variant: "error",
      });
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise = refreshPromise || refreshAccessToken(refreshToken);
      const tokens = await refreshPromise;
      refreshPromise = null;

      updateTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || refreshToken,
        expiresIn: tokens.expires_in,
      });

      originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;

      return api(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      logout();
      showToast({
        title: "Refresh Token Failed",
        description: "Your session has expired. Please login again.",
        variant: "error",
      });

      return Promise.reject(refreshError);
    }
  },
);
