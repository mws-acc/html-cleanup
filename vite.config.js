import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/html-cleanup/" : "/",
  build: {
    outDir: "docs", // Output folder
    emptyOutDir: true, // Clear the docs folder before building
  },
  server: {
    host: true, // Allow external access
    port: 5173,
  },
}));
