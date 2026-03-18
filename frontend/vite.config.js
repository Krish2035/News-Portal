import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// For Vercel, we use a simpler path resolution that doesn't 
// always require fileURLToPath in common build scenarios.
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        // This remains for local development
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      // Direct path resolution for the "@" alias
      "@": path.resolve(new URL('.', import.meta.url).pathname, "./src"),
    },
  },
  build: {
    // Ensures Vite looks for index.html in the correct root
    outDir: 'dist',
    emptyOutDir: true,
  }
});