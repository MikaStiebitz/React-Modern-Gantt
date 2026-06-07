import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "./",
    build: {
        sourcemap: true,
        outDir: "dist",
    },
    server: {
        port: 3000,
        open: true,
    },
    resolve: {
        alias: [
            {
                find: "react-modern-gantt/dist/index.css",
                replacement: resolve(__dirname, "../src/styles/gantt.css"),
            },
            {
                find: "react-modern-gantt",
                replacement: resolve(__dirname, "../src/index.ts"),
            },
            {
                find: "@",
                replacement: resolve(__dirname, "../src"),
            },
        ],
    },
    optimizeDeps: {
        exclude: ["react-modern-gantt"],
    },
});
