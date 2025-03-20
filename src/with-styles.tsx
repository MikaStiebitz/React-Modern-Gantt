import React from "react";
import { GanttChartProps } from "./types";
import { GanttChart as UnstyledGanttChart } from "./components/core";
import "./styles/gantt.css";

/**
 * GanttChartWithStyles - A convenience component that automatically imports CSS
 * Use this component if you want to avoid manually importing styles.
 *
 * Usage:
 * import { GanttChartWithStyles } from 'react-modern-gantt';
 * // No need to import 'react-modern-gantt/dist/index.css'
 */
const GanttChart: React.FC<GanttChartProps> = props => {
    return <UnstyledGanttChart {...props} />;
};

export default GanttChart;
