import React from "react";
import { GanttChartProps } from "./types";
import { GanttChart } from "./components/core";

// Import CSS directly to ensure it's bundled with the component
import "./styles/gantt.css";

/**
 * GanttChartWithStyles - A fully styled component with no external dependencies
 * Use this component for a zero-configuration experience.
 *
 * Die Styling ist bereits enthalten und muss nicht separat importiert werden.
 * Der `darkMode` Parameter wird automatisch berücksichtigt.
 */
const GanttChartWithStyles: React.FC<GanttChartProps> = (props) => {
  // Wir leiten alle Props einfach weiter an die GanttChart-Komponente
  return <GanttChart {...props} />;
};

export { GanttChartWithStyles };
export default GanttChartWithStyles;
