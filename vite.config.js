import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/orange-api": {
        target: "https://fox-heroic-hopelessly.ngrok-free.app",
        changeOrigin: true,
        secure: true,

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "ngrok-skip-browser-warning",
              "true"
            );
          });
        },

        rewrite: (path) =>
          path.replace(/^\/orange-api/, ""),
      },

      "/orangehrm-oauth": {
        target: "https://fox-heroic-hopelessly.ngrok-free.app",
        changeOrigin: true,
        secure: true,

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "ngrok-skip-browser-warning",
              "true"
            );
          });
        },

        rewrite: (path) =>
          path.replace(/^\/orangehrm-oauth/, ""),
      },
    },
  },
});