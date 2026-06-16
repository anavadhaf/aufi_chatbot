import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. Proxy for Authentication / Login requests
      "/orangehrm-oauth": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/orangehrm-oauth/, ""),
      },
      
      // 2. Proxy for Profile Fetching and standard API requests
      "/orange-api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/orange-api/, ""),
      },
    },
  },
});