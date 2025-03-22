"use client"; // This directive tells Next.js this is a client component

import React from "react";
import { GanttChart } from "./core";
import { GanttChartProps, GanttTheme } from "@/types";
import { GanttThemeProvider } from "./core/GanttThemeProvider";

// Extend GanttChartProps to include the optional 'theme' property.
interface NextGanttChartProps extends GanttChartProps {
    theme?: GanttTheme;
}

/**
 * NextGanttChart - Specialized version for Next.js applications
 * Includes the "use client" directive and other Next.js optimizations
 */
export const NextGanttChart: React.FC<NextGanttChartProps> = props => {
    // Destructure theme and darkMode from props, and pass remaining props to GanttChart.
    const { theme, darkMode, ...chartProps } = props;
    return (
        <GanttThemeProvider darkMode={darkMode} theme={theme as GanttTheme}>
            <GanttChart {...chartProps} />
        </GanttThemeProvider>
    );
};

export default NextGanttChart;
