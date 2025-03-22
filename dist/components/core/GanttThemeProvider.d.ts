import React, { ReactNode } from "react";
import { GanttTheme } from "@/types/theme";
interface GanttThemeContextType {
    theme: GanttTheme;
    isDarkMode: boolean;
}
export interface GanttThemeProviderProps {
    children: ReactNode;
    theme?: Partial<GanttTheme>;
    darkMode?: boolean;
}
/**
 * GanttThemeProvider - Provides theme context for the Gantt chart
 * Allows for easy theme customization across all components
 */
export declare const GanttThemeProvider: React.FC<GanttThemeProviderProps>;
export declare const useGanttTheme: () => GanttThemeContextType;
export {};
