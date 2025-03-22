// File: rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import autoprefixer from "autoprefixer";
import { createFilter } from "@rollup/pluginutils";
import pkg from "./package.json" assert { type: "json" };

// Process "use client" directive for Next.js components
const useClientDirectivePlugin = {
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
};

// Define all inputs in one bundle to ensure TypeScript types are generated correctly
export default {
    input: {
        index: "src/index.ts",
        "nextjs/index": "src/nextjs/index.ts",
    },
    output: [
        {
            dir: "dist",
            format: "cjs",
            exports: "named",
            sourcemap: true,
            entryFileNames: "[name].js",
            preserveModules: false,
        },
        {
            dir: "dist",
            format: "esm",
            exports: "named",
            sourcemap: true,
            entryFileNames: "[name].esm.js",
            preserveModules: false,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        useClientDirectivePlugin,
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
            inject: true,
            extract: "dist/index.css",
            config: {
                path: "./postcss.config.mjs",
                ctx: {
                    env: "production",
                },
            },
        }),
        terser(),
    ],
    external: ["react", "react-dom", "date-fns"],
};
