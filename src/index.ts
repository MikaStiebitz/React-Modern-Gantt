/**
 * React Modern Gantt
 * A flexible, customizable Gantt chart component for React applications
 *
 * @module react-modern-gantt
 */

// Import styles directly (this creates a side effect - the CSS will be loaded)
import "./styles/gantt.css";

// Re-export self-contained GanttChart as default export
import GanttChartWithStyles from "./with-styles";
export default GanttChartWithStyles;

// For users who want specific components
export { GanttChart } from "./components/core";
export { GanttChartWithStyles } from "./with-styles"; // For explicit imports

// Task components
export { TaskItem, TaskList, TaskRow } from "./components/task";

// Timeline components
export { Timeline, TodayMarker } from "./components/timeline";

// UI components
export { Tooltip, ViewModeSelector } from "./components/ui";

// Hooks
export { useGanttExport } from "./hooks";
export type { UseGanttExportReturn } from "./hooks";

// Types
export type {
    // Core types
    Task,
    TaskGroup,
    GanttStyles,

    // Component props
    GanttChartProps,
    TaskItemProps,
    TaskListProps,
    TaskRowProps,
    TimelineProps,
    TodayMarkerProps,
    TooltipProps,

    // Render props
    TaskRenderProps,
    TaskListRenderProps,
    TooltipRenderProps,
    ViewModeSelectorRenderProps,
    HeaderRenderProps,
    TimelineHeaderRenderProps,
    TaskColorProps,

    // Utility types
    TaskInteraction,

    // Export types
    ExportFormat,
    ExportOptions,
    ExportResult,
    PdfExportOptions,
    GanttChartRef,
} from "./types";

// Enums
export {
    // Enums
    ViewMode,
    DateDisplayFormat,
} from "./types";

// Export utility functions for advanced usage
export { CollisionService, TaskService, ExportService } from "./services";
export {
    formatDate,
    formatMonth,
    getMonthsBetween,
    getDaysInMonth,
    formatDateRange,
    calculateDuration,
    getDuration,
    findEarliestDate,
    findLatestDate,
    calculateTaskPosition,
    detectTaskOverlaps,
} from "./utils";

// Export themes
export { defaultTheme, darkTheme } from "./themes";
