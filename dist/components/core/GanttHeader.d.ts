import React from "react";
import { ViewMode } from "@/types";
interface GanttHeaderProps {
    title: string;
    darkMode: boolean;
    activeViewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    showViewModeSelector: boolean;
    availableViewModes: ViewMode[] | boolean;
    renderHeader?: any;
    renderViewModeSelector?: any;
    styles: any;
}
/**
 * GanttHeader Component - Renders the header section of the Gantt chart
 */
export declare const GanttHeader: React.FC<GanttHeaderProps>;
export {};
