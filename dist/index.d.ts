/**
 * React Modern Gantt
 * A flexible, customizable Gantt chart component for React applications
 *
 * @module react-modern-gantt
 */
import GanttChartWithStyles from "./with-styles";
export default GanttChartWithStyles;
export { GanttChart } from "./components/core";
export { GanttChartWithStyles } from "./with-styles";
export { TaskItem, TaskList, TaskRow } from "./components/task";
export { Timeline, TodayMarker } from "./components/timeline";
export { Tooltip, ViewModeSelector } from "./components/ui";
export { GanttThemeProvider, useGanttTheme } from "./components/core/GanttThemeProvider";
export type { Task, TaskGroup, GanttStyles, GanttTheme, lightTheme, darkTheme, GanttChartProps, TaskItemProps, TaskListProps, TaskRowProps, TimelineProps, TodayMarkerProps, TooltipProps, TaskRenderProps, TaskListRenderProps, TooltipRenderProps, ViewModeSelectorRenderProps, HeaderRenderProps, TimelineHeaderRenderProps, TaskColorProps, TaskInteraction, } from "./types";
export { ViewMode, DateDisplayFormat, } from "./types";
export { CollisionService, TaskService } from "./services";
export { formatDate, formatMonth, getMonthsBetween, getDaysInMonth, formatDateRange, calculateDuration, getDuration, findEarliestDate, findLatestDate, calculateTaskPosition, detectTaskOverlaps, } from "./utils";
