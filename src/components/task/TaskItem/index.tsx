import React, { useRef } from "react";
import { TaskItemProps } from "@/types";
import TaskItemContent from "./TaskItemContent";
import ResizeHandles from "./ResizeHandles";
import ProgressBar from "./ProgressBar";
import { useProgressDrag } from "./hooks/useProgressDrag";

/**
 * TaskItem Component - Renders an individual task bar in the Gantt chart
 */
const TaskItem: React.FC<TaskItemProps> = ({
    task,
    leftPx,
    widthPx,
    topPx,
    isHovered,
    isDragging,
    editMode,
    showProgress = false,
    instanceId,
    renderTask,
    getTaskColor,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onProgressUpdate,
}) => {
    // Using refs to track elements
    const taskRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Use progress drag hook for interactive progress tracking
    const { progressPercent, isDraggingProgress, handleProgressMouseDown, handleProgressClick } = useProgressDrag({
        task,
        progressBarRef,
        taskRef,
        editMode,
        showProgress,
        onProgressUpdate,
    });

    // Validate task data
    if (!task || !task.id) {
        return null;
    }

    // Use custom render function if provided
    if (renderTask) {
        const customTaskContent = renderTask({
            task,
            leftPx,
            widthPx,
            topPx,
            isHovered,
            isDragging,
            editMode,
            showProgress,
        });

        return (
            <div
                ref={taskRef}
                className="absolute"
                style={{
                    left: `${Math.max(0, leftPx)}px`,
                    width: `${Math.max(20, widthPx)}px`,
                    top: `${topPx}px`,
                }}
                onClick={e => onClick(e, task)}
                onMouseDown={e => onMouseDown(e, task, "move")}
                onMouseEnter={e => onMouseEnter(e, task)}
                onMouseLeave={onMouseLeave}
                data-testid={`task-${task.id}`}
                data-task-id={task.id}
                data-instance-id={instanceId}
                data-dragging={isDragging ? "true" : "false"}>
                {customTaskContent}
            </div>
        );
    }

    // Default task rendering
    // Show handles only when hovered or dragging and in edit mode
    const showHandles = (isHovered || isDragging) && editMode;

    return (
        <div
            ref={taskRef}
            className="rmg-task-item"
            style={{
                left: `${Math.max(0, leftPx)}px`,
                width: `${Math.max(20, widthPx)}px`,
                top: `${topPx}px`,
                willChange: isDragging ? "transform, left, width" : "auto",
            }}
            onClick={e => onClick(e, task)}
            onMouseDown={e => onMouseDown(e, task, "move")}
            onMouseEnter={e => onMouseEnter(e, task)}
            onMouseLeave={onMouseLeave}
            data-testid={`task-${task.id}`}
            data-task-id={task.id}
            data-instance-id={instanceId}
            data-dragging={isDragging ? "true" : "false"}>
            {/* Resize Handles */}
            {showHandles && (
                <ResizeHandles
                    onResizeLeft={e => onMouseDown(e, task, "resize-left")}
                    onResizeRight={e => onMouseDown(e, task, "resize-right")}
                />
            )}

            {/* Task Content */}
            <TaskItemContent task={task} getTaskColor={getTaskColor} isHovered={isHovered} isDragging={isDragging} />

            {/* Progress Bar */}
            {showProgress && typeof progressPercent === "number" && (
                <ProgressBar
                    ref={progressBarRef}
                    percent={progressPercent}
                    isHovered={isHovered}
                    isDraggingProgress={isDraggingProgress}
                    editMode={editMode}
                    showProgress={showProgress}
                    onProgressClick={handleProgressClick}
                    onProgressMouseDown={handleProgressMouseDown}
                />
            )}
        </div>
    );
};

export default TaskItem;
