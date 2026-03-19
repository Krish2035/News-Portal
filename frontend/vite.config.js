import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Standard ESM way to define __dirname for path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    proxy: {
      /**
       * LOCAL DEVELOPMENT PROXY
       * Redirects frontend /api calls to your local backend during development.
       * In production (Vercel), your apiRequest utility handles the full URL.
       */
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      /**
       * The "@" alias allows you to use absolute imports.
       * Example: import apiRequest from "@/utils/api";
       */
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Ensures source maps are handled correctly for easier debugging
    sourcemap: false, 
  }
});