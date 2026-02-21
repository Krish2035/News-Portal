import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        // changeOrigin: true ensures the host header matches the target
        // This is crucial for authentication and cookies to work correctly
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Allows you to use @/ notation for cleaner imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
