import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { readFileSync } from "fs";

// Use the library version from the branch's own package.json so the demo
// always reflects the code it is actually building from (../src), rather than
// whatever is published to npm as "latest".
const libVersion = JSON.parse(
    readFileSync(resolve(__dirname, "../package.json"), "utf-8"),
).version;

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "./",
    define: {
        __LIB_VERSION__: JSON.stringify(libVersion),
    },
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
            // Resolve these from demo/node_modules so Vercel finds them
            // when processing library source files in ../src/
            {
                find: "date-fns",
                replacement: resolve(__dirname, "node_modules/date-fns"),
            },
            {
                find: "html2canvas",
                replacement: resolve(__dirname, "node_modules/html2canvas"),
            },
            {
                find: "jspdf",
                replacement: resolve(__dirname, "node_modules/jspdf"),
            },
        ],
    },
    optimizeDeps: {
        exclude: ["react-modern-gantt"],
    },
});
