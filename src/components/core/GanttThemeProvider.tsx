import React, { createContext, useContext, ReactNode } from "react";

interface GanttThemeContextType {
    darkMode: boolean;
}

const GanttThemeContext = createContext<GanttThemeContextType>({
    darkMode: false,
});

export interface GanttThemeProviderProps {
    children: ReactNode;
    darkMode?: boolean;
}

/**
 * GanttThemeProvider - Provides theme context for the Gantt chart
 * Simple provider to handle dark mode context
 */
export const GanttThemeProvider: React.FC<GanttThemeProviderProps> = ({ children, darkMode = false }) => {
    return <GanttThemeContext.Provider value={{ darkMode }}>{children}</GanttThemeContext.Provider>;
};

// Hook to use the Gantt theme
export const useGanttTheme = () => useContext(GanttThemeContext);
