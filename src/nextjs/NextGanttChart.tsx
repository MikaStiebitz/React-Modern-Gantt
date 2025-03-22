"use client"; // This directive tells Next.js this is a client component

import React from "react";
// Import aus dem Kern-Export
import { GanttChart, GanttThemeProvider } from "../components/core";
import { GanttChartProps } from "../types";

/**
 * NextGanttChart - Specialized version for Next.js applications
 * Includes the "use client" directive and other Next.js optimizations
 */
export const NextGanttChart: React.FC<GanttChartProps> = props => {
    return (
        <GanttThemeProvider darkMode={props.darkMode}>
            <GanttChart {...props} />
        </GanttThemeProvider>
    );
};

export default NextGanttChart;
