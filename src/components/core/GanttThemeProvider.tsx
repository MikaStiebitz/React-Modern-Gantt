import React, { createContext, useContext, ReactNode } from "react";
import { GanttTheme, lightTheme, darkTheme, mergeThemes } from "@/types/theme";

interface GanttThemeContextType {
    theme: GanttTheme;
    isDarkMode: boolean;
}

const GanttThemeContext = createContext<GanttThemeContextType>({
    theme: lightTheme,
    isDarkMode: false,
});

export interface GanttThemeProviderProps {
    children: ReactNode;
    theme?: Partial<GanttTheme>;
    darkMode?: boolean;
}

/**
 * GanttThemeProvider - Provides theme context for the Gantt chart
 * Allows for easy theme customization across all components
 */
export const GanttThemeProvider: React.FC<GanttThemeProviderProps> = ({ children, theme = {}, darkMode = false }) => {
    // Merge the provided theme with the default theme
    const mergedTheme = mergeThemes(theme, darkMode);

    return (
        <GanttThemeContext.Provider value={{ theme: mergedTheme, isDarkMode: darkMode }}>
            {children}
        </GanttThemeContext.Provider>
    );
};

// Hook to use the Gantt theme
export const useGanttTheme = () => useContext(GanttThemeContext);
