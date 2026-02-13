import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import autoprefixer from "autoprefixer";
import { createFilter } from "@rollup/pluginutils";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            exports: "named",
            sourcemap: true,
            inlineDynamicImports: true,
        },
        {
            file: pkg.module,
            format: "esm",
            exports: "named",
            sourcemap: true,
            inlineDynamicImports: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        // Handle "use client" directive with proper sourcemap support
        {
            name: "replace-use-client",
            transform(code, id) {
                // Only apply to .tsx and .ts files
                const filter = createFilter(["**/*.ts", "**/*.tsx"]);
                if (!filter(id)) return null;

                // If the file doesn't include 'use client', return null (no transformation needed)
                if (!code.includes('"use client"') && !code.includes("'use client'")) return null;

                // Replace the directive
                return {
                    code: code.replace(/'use client';?\s*|"use client";?\s*/g, ""),
                    map: { mappings: "" },
                };
            },
        },
        typescript({
            tsconfig: "./tsconfig.json",
            exclude: ["**/__tests__/**", "**/examples/**", "**/example/**"],
            compilerOptions: {
                rootDir: "./src",
                declaration: true,
                declarationDir: "dist",
            },
        }),
        postcss({
            plugins: [autoprefixer()],
            minimize: true,
            modules: false,
            // CSS nicht in JS injizieren, sondern nur als Datei extrahieren
            inject: true,
            // Die CSS-Datei extrahieren
            extract: "index.css",
            config: {
                path: "./postcss.config.mjs",
                ctx: {
                    env: "production",
                },
            },
        }),
        terser(),
    ],
    external: ["react", "react-dom", "date-fns", "html2canvas", "jspdf"],
};
