import { create } from "zustand";
import { persist } from "zustand/middleware";

const getExpiresAt = (expiresIn) => {
  if (!expiresIn) {
    return null;
  }

  return Date.now() + Number(expiresIn) * 1000;
};

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,

      login: ({ accessToken, refreshToken, expiresIn, expiresAt }) =>
        set({
          accessToken,
          refreshToken,
          expiresAt: expiresAt ?? getExpiresAt(expiresIn),
          isAuthenticated: Boolean(accessToken),
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        }),

      updateTokens: ({ accessToken, refreshToken, expiresIn, expiresAt }) =>
        set((state) => ({
          accessToken: accessToken ?? state.accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
          expiresAt: expiresAt ?? getExpiresAt(expiresIn) ?? state.expiresAt,
          isAuthenticated: Boolean(accessToken ?? state.accessToken),
        })),
    }),
    {
      name: "orangehrm-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
