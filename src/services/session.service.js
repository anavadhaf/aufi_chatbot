import { refreshAccessToken } from "./auth.service";
import { useAuthStore } from "../store/auth.store";
import { showToast } from "../utils/toast";

const TOKEN_EXPIRY_BUFFER_MS = 30 * 1000;

let refreshPromise = null;
let hasShownSessionExpiredToast = false;

export class SessionExpiredError extends Error {
  constructor(message = "Session expired") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

function isAccessTokenExpired(expiresAt) {
  if (!expiresAt) {
    return false;
  }

  return Date.now() >= Number(expiresAt) - TOKEN_EXPIRY_BUFFER_MS;
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

export function expireSession({
  title = "Session Expired",
  description = "Please login again to continue.",
} = {}) {
  const { logout } = useAuthStore.getState();

  logout();

  if (!hasShownSessionExpiredToast) {
    hasShownSessionExpiredToast = true;
    showToast({
      title,
      description,
      variant: "error",
    });
  }

  redirectToLogin();
}

export async function ensureValidAccessToken({ forceRefresh = false } = {}) {
  const { accessToken, expiresAt, refreshToken, updateTokens } = useAuthStore.getState();

  if (!accessToken) {
    expireSession();
    throw new SessionExpiredError();
  }

  if (!forceRefresh && !isAccessTokenExpired(expiresAt)) {
    return accessToken;
  }

  if (!refreshToken) {
    expireSession();
    throw new SessionExpiredError();
  }

  try {
    refreshPromise = refreshPromise || refreshAccessToken(refreshToken);
    const tokens = await refreshPromise;

    updateTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || refreshToken,
      expiresIn: tokens.expires_in,
    });

    hasShownSessionExpiredToast = false;

    return tokens.access_token;
  } catch (error) {
    expireSession({
      title: "Session Expired",
      description: "Your session has expired. Please login again.",
    });
    throw new SessionExpiredError(error.message);
  } finally {
    refreshPromise = null;
  }
}
