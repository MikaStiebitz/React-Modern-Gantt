"use client"; // This directive tells Next.js this is a client component

// Export the NextGanttChart component
export { NextGanttChart } from "./NextGanttChart";

// Re-export main types and utilities
// Using relative imports to ensure correct bundling
export * from "../types";
export * from "../utils";
export * from "../services";
