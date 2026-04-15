import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/VOCALink-Web/",
  build: {
    outDir: "docs",
    emptyOutDir: true,      
  },
});
