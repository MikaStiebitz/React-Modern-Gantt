"use client"; // This directive tells Next.js this is a client component

import React from "react";
import { GanttChart } from "../components/core";
import { GanttChartProps, GanttTheme } from "../types";
import { GanttThemeProvider } from "../components/core/GanttThemeProvider";

/**
 * NextGanttChart - Specialized version for Next.js applications
 * Includes the "use client" directive and other Next.js optimizations
 */
export const NextGanttChart: React.FC<
    GanttChartProps & {
        theme?: Partial<GanttTheme>;
    }
> = props => {
    return (
        <GanttThemeProvider darkMode={props.darkMode} theme={props.theme}>
            <GanttChart {...props} />
        </GanttThemeProvider>
    );
};
