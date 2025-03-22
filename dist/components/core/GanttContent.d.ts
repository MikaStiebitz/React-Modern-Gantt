import React from "react";
import { TaskGroup, ViewMode } from "@/types";
interface GanttContentProps {
    tasks: TaskGroup[];
    startDate: Date;
    endDate: Date;
    timeUnits: Date[];
    totalUnits: number;
    currentUnitIndex: number;
    viewMode: ViewMode;
    editMode: boolean;
    headerLabel: string;
    showProgress: boolean;
    showCurrentDateMarker: boolean;
    todayLabel: string;
    currentDate: Date;
    locale: string;
    unitWidth: number;
    smoothDragging: boolean;
    movementThreshold: number;
    animationSpeed: number;
    rowHeight: number;
    renderTaskList?: any;
    renderTask?: any;
    renderTooltip?: any;
    renderTimelineHeader?: any;
    getTaskColor?: any;
    onTaskUpdate?: (groupId: string, updatedTask: any) => void;
    onTaskClick?: (task: any, group: TaskGroup) => void;
    onTaskSelect?: (task: any, isSelected: boolean) => void;
    onTaskDoubleClick?: (task: any) => void;
    onGroupClick?: (group: TaskGroup) => void;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    styles: any;
}
/**
 * GanttContent Component - Renders the main content area of the Gantt chart
 */
export declare const GanttContent: React.FC<GanttContentProps>;
export {};
