import React from "react";
interface ProgressBarProps {
    percent: number;
    isHovered: boolean;
    isDraggingProgress: boolean;
    editMode: boolean;
    showProgress: boolean;
    onProgressClick: (e: React.MouseEvent) => void;
    onProgressMouseDown: (e: React.MouseEvent) => void;
}
/**
 * ProgressBar Component - Renders the progress bar for a task
 */
declare const ProgressBar: React.ForwardRefExoticComponent<ProgressBarProps & React.RefAttributes<HTMLDivElement>>;
export default ProgressBar;
