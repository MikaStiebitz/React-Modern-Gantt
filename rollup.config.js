import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import autoprefixer from "autoprefixer";
import dts from "rollup-plugin-dts";
import { createFilter } from "@rollup/pluginutils";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const jsConfig = {
    input: "src/index.ts",
    output: [
        {
            file: pkg.exports["."].require.default,
            format: "cjs",
            exports: "named",
            sourcemap: true,
            inlineDynamicImports: true,
        },
        {
            file: pkg.exports["."].import.default,
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
            // Declarations are produced separately as a single bundled file (see dtsConfig below)
            // so that the published .d.ts has no extensionless relative imports or "@/" aliases.
            compilerOptions: {
                rootDir: "./src",
                declaration: false,
                declarationDir: undefined,
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

// Bundle all type declarations into one self-contained file. Unbundled declarations keep
// extensionless relative specifiers (./components/core) and path aliases (@/types), which
// TypeScript cannot resolve under moduleResolution "node16"/"nodenext".
const dtsConfig = {
    input: "src/index.ts",
    output: [
        // ESM-flavoured declarations (package.json has "type": "module")
        { file: pkg.exports["."].import.types, format: "es" },
        // CJS-flavoured declarations for `require()` consumers
        { file: pkg.exports["."].require.types, format: "es" },
    ],
    plugins: [
        // CSS is handled by the JS build; it has no types.
        {
            name: "ignore-css",
            resolveId(source) {
                return source.endsWith(".css") ? { id: source, external: true } : null;
            },
        },
        dts({ tsconfig: "./tsconfig.json" }),
    ],
    external: ["react", "react-dom", "date-fns", "html2canvas", "jspdf", /\.css$/],
};

export default [jsConfig, dtsConfig];
