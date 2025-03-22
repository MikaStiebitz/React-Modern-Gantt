import React from "react";
import { GanttChartProps, GanttTheme } from "@/types";
interface NextGanttChartProps extends GanttChartProps {
    theme?: GanttTheme;
}
/**
 * NextGanttChart - Specialized version for Next.js applications
 * Includes the "use client" directive and other Next.js optimizations
 */
export declare const NextGanttChart: React.FC<NextGanttChartProps>;
export default NextGanttChart;
