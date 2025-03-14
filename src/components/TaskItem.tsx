import React, { useRef, useEffect, useState } from "react";
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
    onProgressUpdate?: (task: Task, newPercent: number) => void;
}

/**
 * TaskItem Component
 *
 * Renders a single task bar in the Gantt chart
 * Enhanced with smoother animations and transitions
 * Added interactive progress bubble for adjusting task completion
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
    // Show handles only when hovered or dragging and in edit mode
    const showHandles = (isHovered || isDragging) && editMode;
    const taskRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const wasUpdated = useRef<boolean>(false);
    const prevLeft = useRef<number>(leftPx);
    const prevWidth = useRef<number>(widthPx);

    // Progress dragging state
    const [isDraggingProgress, setIsDraggingProgress] = useState(false);
    const [progressPercent, setProgressPercent] = useState(task.percent || 0);

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

    // Progress bubble drag handlers
    const handleProgressMouseDown = (e: React.MouseEvent) => {
        if (!editMode || !showProgress) return;

        e.stopPropagation();
        e.preventDefault();

        setIsDraggingProgress(true);

        // Add global event listeners for dragging
        document.addEventListener("mousemove", handleProgressMouseMove);
        document.addEventListener("mouseup", handleProgressMouseUp);
    };

    const handleProgressMouseMove = (e: MouseEvent) => {
        if (!isDraggingProgress || !progressBarRef.current || !taskRef.current) return;

        // Get progress bar bounds
        const barRect = progressBarRef.current.getBoundingClientRect();
        const taskRect = taskRef.current.getBoundingClientRect();

        // Calculate new progress percentage based on mouse position
        const barWidth = taskRect.width - 2; // Account for 1px padding on each side
        const clickX = Math.max(0, Math.min(barWidth, e.clientX - taskRect.left));
        const newPercent = Math.round((clickX / barWidth) * 100);

        // Update progress value with constraints
        setProgressPercent(Math.max(0, Math.min(100, newPercent)));
    };

    const handleProgressMouseUp = () => {
        if (!isDraggingProgress) return;

        setIsDraggingProgress(false);

        // Remove global event listeners
        document.removeEventListener("mousemove", handleProgressMouseMove);
        document.removeEventListener("mouseup", handleProgressMouseUp);

        // Call update handler with the updated progress
        if (onProgressUpdate && progressPercent !== task.percent) {
            onProgressUpdate(task, progressPercent);
        }
    };

    // Update progress state when task changes
    useEffect(() => {
        setProgressPercent(task.percent || 0);
    }, [task.percent]);

    // Check if task was updated for visual feedback
    useEffect(() => {
        // Track if the task position was updated
        if (taskRef.current && (prevLeft.current !== leftPx || prevWidth.current !== widthPx)) {
            wasUpdated.current = true;

            // Add updated class for visual feedback
            taskRef.current.classList.add("rmg-task-updated");

            // Remove class after animation completes
            const timeout = setTimeout(() => {
                if (taskRef.current) {
                    taskRef.current.classList.remove("rmg-task-updated");
                }
                wasUpdated.current = false;
            }, 1000);

            // Update refs
            prevLeft.current = leftPx;
            prevWidth.current = widthPx;

            return () => clearTimeout(timeout);
        }
    }, [leftPx, widthPx]);

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleProgressMouseMove);
            document.removeEventListener("mouseup", handleProgressMouseUp);
        };
    }, []);

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
            ref={taskRef}
            className={`absolute h-8 rounded ${bgColorClass} ${borderColorClass} ${textColor} flex items-center px-2 text-xs font-medium ${
                editMode ? "cursor-move" : "cursor-pointer"
            } ${isDragging ? "shadow-lg" : ""}`}
            style={{
                left: `${Math.max(0, leftPx)}px`,
                width: `${Math.max(20, widthPx)}px`,
                top: `${topPx}px`,
                ...bgColorStyle,
                ...borderColorStyle,
                // Add will-change for better performance during animations
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
            {/* Left resize handle */}
            {showHandles && (
                <div
                    className="absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-l rmg-resize-handle"
                    onMouseDown={handleResizeLeft}
                />
            )}

            {/* Task name */}
            <div className="truncate select-none">{task.name || "Unnamed Task"}</div>

            {/* Progress bar with interactive bubble */}
            {showProgress && typeof progressPercent === "number" && (
                <div
                    ref={progressBarRef}
                    className={`absolute bottom-1 left-1 right-1 h-2 bg-black bg-opacity-20 dark:bg-opacity-30 rounded-full overflow-hidden ${
                        editMode ? "cursor-pointer" : ""
                    }`}
                    onClick={e => {
                        if (editMode && showProgress && onProgressUpdate) {
                            e.stopPropagation();
                            const barWidth = e.currentTarget.clientWidth;
                            const clickX = e.nativeEvent.offsetX;
                            const newPercent = Math.round((clickX / barWidth) * 100);
                            setProgressPercent(newPercent);
                            onProgressUpdate(task, newPercent);
                        }
                    }}>
                    <div
                        className="h-full bg-white dark:bg-gray-200 rounded-full relative"
                        style={{ width: `${progressPercent}%` }}>
                        {/* Progress bubble handle */}
                        {editMode && (isHovered || isDraggingProgress) && (
                            <div
                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 h-4 w-4 rounded-full bg-white border-2 ${
                                    borderColor || backgroundColor.startsWith("bg-")
                                        ? borderColorClass || bgColorClass
                                        : "border-blue-500"
                                } cursor-ew-resize shadow-sm hover:shadow-md transition-shadow ${
                                    isDraggingProgress ? "scale-110" : ""
                                }`}
                                onMouseDown={handleProgressMouseDown}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Right resize handle */}
            {showHandles && (
                <div
                    className="absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-r rmg-resize-handle"
                    onMouseDown={handleResizeRight}
                />
            )}
        </div>
    );
};

export default TaskItem;
