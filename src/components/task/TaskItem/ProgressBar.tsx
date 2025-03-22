import React, { forwardRef } from "react";

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
const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ percent, isHovered, isDraggingProgress, editMode, showProgress, onProgressClick, onProgressMouseDown }, ref) => {
        return (
            <div ref={ref} className="rmg-progress-bar" onClick={onProgressClick}>
                <div className="rmg-progress-fill" style={{ width: `${percent}%` }}>
                    {/* Progress bubble handle */}
                    {editMode && (isHovered || isDraggingProgress) && (
                        <div
                            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 h-4 w-4 rounded-full bg-white dark:bg-gray-300 border-2 border-blue-500 dark:border-blue-400 cursor-ew-resize shadow-sm hover:shadow-md transition-shadow ${
                                isDraggingProgress ? "scale-110" : ""
                            }`}
                            onMouseDown={onProgressMouseDown}
                        />
                    )}
                </div>
            </div>
        );
    }
);

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
