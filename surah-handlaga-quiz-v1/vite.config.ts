import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Static single-page build: the quiz runs entirely in the browser, so the
// output in dist/client is served as-is by Netlify.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
