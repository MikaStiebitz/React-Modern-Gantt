/**
 * React Modern Gantt
 * A flexible, customizable Gantt chart component for React applications
 *
 * @module react-modern-gantt
 */

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

// Theme components
export { GanttThemeProvider, useGanttTheme } from "./components/core/GanttThemeProvider";

// Types
export type {
    // Core types
    Task,
    TaskGroup,
    GanttStyles,
    GanttTheme,
    lightTheme,
    darkTheme,

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
} from "./types";

// Enums
export {
    // Enums
    ViewMode,
    DateDisplayFormat,
} from "./types";

// Export utility functions for advanced usage
export { CollisionService, TaskService } from "./services";
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
