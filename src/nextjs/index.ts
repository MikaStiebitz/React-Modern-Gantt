"use client"; // This directive tells Next.js this is a client component

// Export the NextGanttChart component
export { NextGanttChart } from "./NextGanttChart";

// Re-export main types and utilities for Next.js users
export * from "../types";
export * from "../utils";
export * from "../services";
export { GanttThemeProvider, useGanttTheme } from "../components/core";
