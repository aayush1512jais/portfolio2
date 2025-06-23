import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import pkg from "./package.json" assert { type: "json" };

// Get base path from homepage in package.json
const getBasePath = () => {
  if (pkg.homepage) {
    try {
      const url = new URL(pkg.homepage);
      let pathname = url.pathname;
      if (!pathname.endsWith('/')) pathname += '/';
      return pathname;
    } catch {
      // fallback
      return "/";
    }
  }
  return "/";
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: getBasePath(),
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
