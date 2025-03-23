import React from "react";
import { GanttChartProps } from "./types";
import "./styles/gantt.css";
/**
 * GanttChartWithStyles - A fully styled component with no external dependencies
 * Use this component for a zero-configuration experience.
 *
 * Die Styling ist bereits enthalten und muss nicht separat importiert werden.
 * Der `darkMode` Parameter wird automatisch berücksichtigt.
 */
declare const GanttChartWithStyles: React.FC<GanttChartProps>;
export { GanttChartWithStyles };
export default GanttChartWithStyles;
