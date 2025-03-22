import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import autoprefixer from "autoprefixer";
import { createFilter } from "@rollup/pluginutils";

// Process "use client" directive für Next.js components
const useClientDirectivePlugin = {
    name: "replace-use-client",
    transform(code, id) {
        const filter = createFilter(["**/*.ts", "**/*.tsx"]);
        if (!filter(id)) return null;
        if (!code.includes('"use client"') && !code.includes("'use client'")) return null;
        return {
            code: code.replace(/'use client';?\s*|"use client";?\s*/g, ""),
            map: { mappings: "" },
        };
    },
};

// Einfache Lösung: Ein Rollup-Build für alle Komponenten
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
        },
        {
            dir: "dist",
            format: "esm",
            exports: "named",
            sourcemap: true,
            entryFileNames: "[name].esm.js",
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        useClientDirectivePlugin,
        typescript({
            tsconfig: "./tsconfig.json",
            noEmitOnError: true,
            declaration: false,
        }),
        postcss({
            plugins: [autoprefixer()],
            minimize: true,
            modules: false,
            inject: true,
            extract: false,
        }),
        terser(),
    ],
    external: ["react", "react-dom", "date-fns"],
};
