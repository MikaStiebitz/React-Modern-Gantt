import React, { ReactNode } from "react";
interface GanttThemeContextType {
    darkMode: boolean;
}
export interface GanttThemeProviderProps {
    children: ReactNode;
    darkMode?: boolean;
}
/**
 * GanttThemeProvider - Provides theme context for the Gantt chart
 * Simple provider to handle dark mode context
 */
export declare const GanttThemeProvider: React.FC<GanttThemeProviderProps>;
export declare const useGanttTheme: () => GanttThemeContextType;
export {};
