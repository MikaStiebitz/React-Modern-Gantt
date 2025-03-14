import React from "react";
import { Task, TaskColorProps } from "../utils/types";

interface TaskItemProps {
    task: Task;
    leftPx: number;
    widthPx: number;
    topPx: number;
    isHovered: boolean;
    isDragging: boolean;
    editMode: boolean;
    showProgress?: boolean;
    instanceId: string;
    renderTask?: (props: {
        task: Task;
        leftPx: number;
        widthPx: number;
        topPx: number;
        isHovered: boolean;
        isDragging: boolean;
        editMode: boolean;
        showProgress?: boolean;
    }) => React.ReactNode;
    getTaskColor?: (props: TaskColorProps) => {
        backgroundColor: string;
        borderColor?: string;
        textColor?: string;
    };
    onMouseDown: (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => void;
    onMouseEnter: (event: React.MouseEvent, task: Task) => void;
    onMouseLeave: () => void;
    onClick: (event: React.MouseEvent, task: Task) => void;
}

/**
 * TaskItem Component
 *
 * Renders a single task bar in the Gantt chart
 * Supports dragging, resizing, and progress display
 * Now with custom rendering capabilities
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
}) => {
    // Show handles only when hovered or dragging and in edit mode
    const showHandles = (isHovered || isDragging) && editMode;

    if (!task || !task.id) {
        console.warn("TaskItem: Invalid task data", task);
        return null;
    }

    // Get task colors - either from custom function or default
    let backgroundColor = task.color || "bg-gantt-task";
    let borderColor = "";
    let textColor = "text-gantt-task-text";

    if (getTaskColor) {
        const colors = getTaskColor({ task, isHovered, isDragging });
        backgroundColor = colors.backgroundColor;
        borderColor = colors.borderColor || "";
        textColor = colors.textColor || textColor;
    }

    // Handle resize interactions
    const handleResizeLeft = (e: React.MouseEvent) => {
        e.stopPropagation();
        onMouseDown(e, task, "resize-left");
    };

    const handleResizeRight = (e: React.MouseEvent) => {
        e.stopPropagation();
        onMouseDown(e, task, "resize-right");
    };

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
                data-instance-id={instanceId}>
                {customTaskContent}
            </div>
        );
    }

    // Calculate if we need to apply the background color as a class or inline style
    const bgColorStyle = backgroundColor.startsWith("bg-") ? {} : { backgroundColor };
    const bgColorClass = backgroundColor.startsWith("bg-") ? backgroundColor : "";

    const borderColorStyle = borderColor
        ? borderColor.startsWith("border-")
            ? {}
            : { borderColor, borderWidth: "1px" }
        : {};
    const borderColorClass = borderColor && borderColor.startsWith("border-") ? borderColor : "";

    return (
        <div
            className={`absolute h-8 rounded ${bgColorClass} ${borderColorClass} ${textColor} flex items-center px-2 text-xs font-medium ${
                editMode ? "cursor-move" : "cursor-pointer"
            }`}
            style={{
                left: `${Math.max(0, leftPx)}px`,
                width: `${Math.max(20, widthPx)}px`,
                top: `${topPx}px`,
                ...bgColorStyle,
                ...borderColorStyle,
            }}
            onClick={e => onClick(e, task)}
            onMouseDown={e => onMouseDown(e, task, "move")}
            onMouseEnter={e => onMouseEnter(e, task)}
            onMouseLeave={onMouseLeave}
            data-testid={`task-${task.id}`}
            data-task-id={task.id}
            data-instance-id={instanceId}>
            {/* Left resize handle */}
            {showHandles && (
                <div
                    className="absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-l"
                    onMouseDown={handleResizeLeft}
                />
            )}

            {/* Task name */}
            <div className="truncate select-none">{task.name || "Unnamed Task"}</div>

            {/* Progress bar */}
            {showProgress && typeof task.percent === "number" && (
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 dark:bg-opacity-30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white dark:bg-gray-200 rounded-full"
                        style={{ width: `${task.percent}%` }}
                    />
                </div>
            )}

            {/* Right resize handle */}
            {showHandles && (
                <div
                    className="absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-r"
                    onMouseDown={handleResizeRight}
                />
            )}
        </div>
    );
};

export default TaskItem;
