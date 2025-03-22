import { useRef, useState, useCallback, useEffect } from "react";
import { Task, TaskGroup, ViewMode } from "@/types";
import { TaskService } from "@/services";

interface UseTaskInteractionsProps {
    taskGroup: TaskGroup;
    startDate: Date;
    endDate: Date;
    editMode: boolean;
    viewMode: ViewMode | undefined;
    monthWidth: number;
    totalMonths: number;
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
    rowRef: React.RefObject<HTMLDivElement | null>;
    instanceId: string;
    smoothDragging: boolean;
    movementThreshold: number;
    animationSpeed: number;
}

/**
 * Hook for managing task interactions (drag, resize, hover)
 */
export const useTaskInteractions = ({
    taskGroup,
    startDate,
    endDate,
    editMode,
    viewMode,
    monthWidth,
    totalMonths,
    onTaskUpdate,
    onTaskClick,
    onTaskSelect,
    rowRef,
    instanceId,
    smoothDragging,
    movementThreshold,
    animationSpeed,
}: UseTaskInteractionsProps) => {
    // Task interaction states
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);
    const [dragType, setDragType] = useState<"move" | "resize-left" | "resize-right" | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [previewTask, setPreviewTask] = useState<Task | null>(null);
    const [initialTaskState, setInitialTaskState] = useState<{
        left: number;
        width: number;
        startDate: Date;
        endDate: Date;
    } | null>(null);

    // Animation refs
    const animationFrameRef = useRef<number | null>(null);
    const lastMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const targetPositionRef = useRef<{ left: number; width: number } | null>(null);
    const currentPositionRef = useRef<{ left: number; width: number } | null>(null);
    const velocityRef = useRef<{ left: number; width: number }>({ left: 0, width: 0 });
    const lastUpdateTimeRef = useRef<number>(0);

    // Refs for task interactions
    const draggingTaskRef = useRef<Task | null>(null);
    const previewTaskRef = useRef<Task | null>(null);
    const taskElementRef = useRef<HTMLElement | null>(null);

    // Calculate if we should use smooth dragging - DISABLED for day view
    const shouldUseSmoothDragging = smoothDragging && viewMode !== ViewMode.DAY;

    // Task update helpers
    const updateDraggingTask = (task: Task) => {
        const taskCopy = {
            ...task,
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
        };
        setDraggingTask(taskCopy);
        draggingTaskRef.current = taskCopy;
    };

    const updatePreviewTask = (task: Task) => {
        const taskCopy = {
            ...task,
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
        };
        setPreviewTask(taskCopy);
        previewTaskRef.current = taskCopy;
    };

    // Animation function
    const animateTaskMovement = useCallback(() => {
        if (!taskElementRef.current || !targetPositionRef.current || !currentPositionRef.current) {
            animationFrameRef.current = null;
            return;
        }

        const now = Date.now();
        const elapsed = now - lastUpdateTimeRef.current;
        lastUpdateTimeRef.current = now;

        // Smooth animation coefficient
        const easing = animationSpeed || 0.25;

        // Calculate new position with easing
        const newLeft =
            currentPositionRef.current.left +
            (targetPositionRef.current.left - currentPositionRef.current.left) * easing;
        const newWidth =
            currentPositionRef.current.width +
            (targetPositionRef.current.width - currentPositionRef.current.width) * easing;

        // Update velocity for more natural animation
        velocityRef.current.left = (newLeft - currentPositionRef.current.left) / (elapsed || 16);
        velocityRef.current.width = (newWidth - currentPositionRef.current.width) / (elapsed || 16);

        // Update current position
        currentPositionRef.current = { left: newLeft, width: newWidth };

        // Apply to DOM - direct DOM manipulation for smooth animation
        taskElementRef.current.style.left = `${newLeft}px`;
        taskElementRef.current.style.width = `${newWidth}px`;

        // Calculate and update dates based on current position
        if (draggingTaskRef.current) {
            updateDatesFromPosition(newLeft, newWidth);
        }

        // Continue animation loop
        animationFrameRef.current = requestAnimationFrame(animateTaskMovement);
    }, [animationSpeed]);

    // Update dates based on visual position
    const updateDatesFromPosition = useCallback(
        (left: number, width: number) => {
            if (!draggingTaskRef.current) return;

            try {
                // For day view, apply precise date calculation
                if (viewMode === ViewMode.DAY) {
                    // Calculate days from start position
                    const daysFromStart = Math.round(left / monthWidth);

                    // Calculate exact days span
                    const daysSpan = Math.max(1, Math.round(width / monthWidth));

                    // Apply precise day calculations
                    const baseDate = new Date(startDate);
                    baseDate.setHours(0, 0, 0, 0);

                    const newStartDate = new Date(baseDate);
                    newStartDate.setDate(baseDate.getDate() + daysFromStart);
                    newStartDate.setHours(0, 0, 0, 0);

                    const newEndDate = new Date(newStartDate);
                    newEndDate.setDate(newStartDate.getDate() + daysSpan - 1);
                    newEndDate.setHours(23, 59, 59, 999);

                    // Ensure dates are within the timeline boundaries
                    const startTime = startDate.getTime();
                    const endTime = endDate.getTime();

                    const constrainedStartDate = new Date(Math.max(startTime, newStartDate.getTime()));
                    const constrainedEndDate = new Date(Math.min(endTime, newEndDate.getTime()));

                    // Create updated task with the new dates
                    const updatedTask = {
                        ...draggingTaskRef.current,
                        startDate: constrainedStartDate,
                        endDate: constrainedEndDate,
                    };

                    // Update preview state
                    updatePreviewTask(updatedTask);
                } else {
                    // Use TaskService for regular calculation
                    const { newStartDate, newEndDate } = TaskService.calculateDatesFromPosition(
                        left,
                        width,
                        startDate,
                        endDate,
                        totalMonths,
                        monthWidth,
                        viewMode
                    );

                    const updatedTask = {
                        ...draggingTaskRef.current,
                        startDate: newStartDate,
                        endDate: newEndDate,
                    };

                    updatePreviewTask(updatedTask);
                }
            } catch (error) {
                console.error("Error updating dates:", error);
            }
        },
        [draggingTaskRef, monthWidth, startDate, endDate, totalMonths, viewMode]
    );

    // Finalize task positioning on mouse up
    const finalizeTaskPosition = useCallback(() => {
        if (!taskElementRef.current || !targetPositionRef.current || !draggingTaskRef.current) return;

        // Get final position
        let finalLeft = targetPositionRef.current.left;
        let finalWidth = targetPositionRef.current.width;

        // Apply snapping for final position in day mode
        if (viewMode === ViewMode.DAY) {
            // Snap to day grid
            finalLeft = Math.round(finalLeft / monthWidth) * monthWidth;
            finalWidth = Math.round(finalWidth / monthWidth) * monthWidth;

            // Ensure minimum width
            finalWidth = Math.max(monthWidth, finalWidth);

            // Apply final position to element with transition
            taskElementRef.current.style.transition =
                "transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out";
            taskElementRef.current.style.left = `${finalLeft}px`;
            taskElementRef.current.style.width = `${finalWidth}px`;

            // Update dates from the snapped position
            updateDatesFromPosition(finalLeft, finalWidth);
        }
        // Apply snapping for other modes if desired
        else if (!shouldUseSmoothDragging) {
            taskElementRef.current.style.transition =
                "transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out";
            taskElementRef.current.style.left = `${finalLeft}px`;
            taskElementRef.current.style.width = `${finalWidth}px`;
        }

        // Calculate final dates
        let finalTask = previewTaskRef.current;
        if (!finalTask) return;

        // Verify final task is within timeline bounds
        const timelineStartTime = startDate.getTime();
        const timelineEndTime = endDate.getTime();

        // Ensure task dates are within bounds
        if (finalTask.startDate.getTime() < timelineStartTime) {
            finalTask = {
                ...finalTask,
                startDate: new Date(timelineStartTime),
            };
        }

        if (finalTask.endDate.getTime() > timelineEndTime) {
            finalTask = {
                ...finalTask,
                endDate: new Date(timelineEndTime),
            };
        }

        // Call update handler with the final task
        if (onTaskUpdate && finalTask) {
            try {
                onTaskUpdate(taskGroup.id, finalTask);
            } catch (error) {
                console.error("Error in onTaskUpdate:", error);
            }
        }
    }, [
        taskElementRef,
        targetPositionRef,
        draggingTaskRef,
        previewTaskRef,
        viewMode,
        monthWidth,
        shouldUseSmoothDragging,
        startDate,
        endDate,
        onTaskUpdate,
        taskGroup.id,
        updateDatesFromPosition,
    ]);

    // Task interaction handlers
    const handleTaskClick = useCallback(
        (event: React.MouseEvent, task: Task) => {
            if (onTaskClick && !draggingTask) {
                onTaskClick(task, taskGroup);
            }

            if (onTaskSelect) {
                onTaskSelect(task, true);
            }
        },
        [onTaskClick, onTaskSelect, draggingTask, taskGroup]
    );

    const handleTaskMouseEnter = useCallback(
        (event: React.MouseEvent, task: Task) => {
            if (!draggingTask) {
                setHoveredTask(task);
                updateTooltipPosition(event);
            }
        },
        [draggingTask]
    );

    const handleTaskMouseLeave = useCallback(() => {
        if (!draggingTask) {
            setHoveredTask(null);
        }
    }, [draggingTask]);

    const updateTooltipPosition = useCallback(
        (e: React.MouseEvent | MouseEvent) => {
            if (rowRef.current) {
                const rect = rowRef.current.getBoundingClientRect();
                setTooltipPosition({
                    x: e.clientX - rect.left + 20,
                    y: e.clientY - rect.top,
                });
            }
        },
        [rowRef]
    );

    const handleMouseDown = useCallback(
        (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => {
            if (!editMode) return;

            event.preventDefault();
            event.stopPropagation();

            // Find the task element
            const taskEl = document.querySelector(
                `[data-task-id="${task.id}"][data-instance-id="${instanceId}"]`
            ) as HTMLElement;

            if (!taskEl) return;
            taskElementRef.current = taskEl;

            // Store the initial state
            const initialLeft = parseFloat(taskEl.style.left || "0");
            const initialWidth = parseFloat(taskEl.style.width || "0");

            setInitialTaskState({
                left: initialLeft,
                width: initialWidth,
                startDate: new Date(task.startDate),
                endDate: new Date(task.endDate),
            });

            // Initialize animation refs
            targetPositionRef.current = { left: initialLeft, width: initialWidth };
            currentPositionRef.current = { left: initialLeft, width: initialWidth };
            lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
            lastUpdateTimeRef.current = Date.now();
            velocityRef.current = { left: 0, width: 0 };

            // Update task element data attribute for styling
            taskEl.setAttribute("data-dragging", "true");

            if (shouldUseSmoothDragging) {
                taskEl.style.transition = "none"; // We'll handle the animation manually
            } else {
                taskEl.style.transition = "none";
            }

            // Set up dragging state
            setDraggingTask(task);
            setDragType(type);
            setDragStartX(event.clientX);
            setPreviewTask(task);

            updateDraggingTask(task);
            updatePreviewTask(task);

            // Start animation loop (only for smooth dragging)
            if (animationFrameRef.current === null && shouldUseSmoothDragging) {
                animationFrameRef.current = requestAnimationFrame(animateTaskMovement);
            }

            // Add global event listeners
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
        },
        [editMode, instanceId, shouldUseSmoothDragging, animateTaskMovement]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent | MouseEvent) => {
            // Store current mouse position for animation
            lastMousePositionRef.current = { x: e.clientX, y: e.clientY };

            // Update tooltip position
            if (e instanceof MouseEvent && hoveredTask && rowRef.current) {
                const rect = rowRef.current.getBoundingClientRect();
                setTooltipPosition({
                    x: e.clientX - rect.left + 20,
                    y: e.clientY - rect.top,
                });
            } else if (!(e instanceof MouseEvent)) {
                updateTooltipPosition(e as React.MouseEvent);
            }

            // Handle task dragging and resizing
            if (draggingTask && dragType && initialTaskState && rowRef.current && targetPositionRef.current) {
                try {
                    // Calculate the total movement since drag started
                    const totalDeltaX = e.clientX - dragStartX;

                    // Get the timeline's total width
                    const totalWidth = totalMonths * monthWidth;

                    // Calculate new target position based on drag type
                    let newLeft = targetPositionRef.current.left;
                    let newWidth = targetPositionRef.current.width;

                    switch (dragType) {
                        case "move":
                            // Move task with bounds checking
                            newLeft = Math.max(
                                0,
                                Math.min(totalWidth - initialTaskState.width, initialTaskState.left + totalDeltaX)
                            );

                            // Special handling for day view (immediate snapping)
                            if (viewMode === ViewMode.DAY) {
                                newLeft = Math.round(newLeft / monthWidth) * monthWidth;
                            }
                            break;

                        case "resize-left":
                            // Resize from left with minimum width
                            const maxLeftDelta = initialTaskState.width - 20;
                            const leftDelta = Math.min(maxLeftDelta, totalDeltaX);

                            newLeft = Math.max(0, initialTaskState.left + leftDelta);

                            // Special handling for day view (immediate snapping)
                            if (viewMode === ViewMode.DAY) {
                                newLeft = Math.round(newLeft / monthWidth) * monthWidth;
                            }

                            // Calculate width to maintain right edge position
                            const rightEdge = initialTaskState.left + initialTaskState.width;
                            newWidth = Math.max(20, rightEdge - newLeft);

                            // Special handling for day view (ensure full day widths)
                            if (viewMode === ViewMode.DAY) {
                                newWidth = Math.round(newWidth / monthWidth) * monthWidth;
                                newWidth = Math.max(monthWidth, newWidth); // Minimum one day
                            }
                            break;

                        case "resize-right":
                            // Resize from right with minimum width
                            newWidth = Math.max(
                                20,
                                Math.min(totalWidth - initialTaskState.left, initialTaskState.width + totalDeltaX)
                            );

                            // Special handling for day view (ensure full day widths)
                            if (viewMode === ViewMode.DAY) {
                                newWidth = Math.round(newWidth / monthWidth) * monthWidth;
                                newWidth = Math.max(monthWidth, newWidth); // Minimum one day
                            }
                            break;
                    }

                    // Update target position reference
                    targetPositionRef.current = { left: newLeft, width: newWidth };

                    // Apply position immediately for day view mode
                    if (viewMode === ViewMode.DAY && taskElementRef.current) {
                        taskElementRef.current.style.left = `${newLeft}px`;
                        taskElementRef.current.style.width = `${newWidth}px`;
                        updateDatesFromPosition(newLeft, newWidth);
                    }
                    // Start animation for smooth dragging in other view modes
                    else if (shouldUseSmoothDragging) {
                        if (animationFrameRef.current === null) {
                            lastUpdateTimeRef.current = Date.now();
                            animationFrameRef.current = requestAnimationFrame(animateTaskMovement);
                        }
                    }
                    // Direct update for non-smooth non-day view modes
                    else if (taskElementRef.current) {
                        taskElementRef.current.style.left = `${newLeft}px`;
                        taskElementRef.current.style.width = `${newWidth}px`;
                        updateDatesFromPosition(newLeft, newWidth);
                    }
                } catch (error) {
                    console.error("Error in handleMouseMove:", error);
                }
            }
        },
        [
            draggingTask,
            dragType,
            initialTaskState,
            viewMode,
            updateTooltipPosition,
            dragStartX,
            totalMonths,
            monthWidth,
            shouldUseSmoothDragging,
            updateDatesFromPosition,
            rowRef,
            hoveredTask,
            animateTaskMovement,
        ]
    );

    const handleMouseUp = useCallback(() => {
        try {
            // Cancel any ongoing animation
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            // Finalize task position with snapping
            finalizeTaskPosition();

            // Clean up animation state
            if (taskElementRef.current) {
                // Reset the dragging state
                taskElementRef.current.setAttribute("data-dragging", "false");

                // Reset transitions after a short delay to allow final animation to complete
                setTimeout(() => {
                    if (taskElementRef.current) {
                        taskElementRef.current.style.transition = "";
                    }
                }, 200);
            }
        } catch (error) {
            console.error("Error in handleMouseUp:", error);
        } finally {
            // Reset all drag states
            setDraggingTask(null);
            setDragType(null);
            setPreviewTask(null);
            setInitialTaskState(null);
            draggingTaskRef.current = null;
            previewTaskRef.current = null;
            taskElementRef.current = null;
            targetPositionRef.current = null;
            currentPositionRef.current = null;

            // Remove global event listeners
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        }
    }, [finalizeTaskPosition, handleMouseMove]);

    // Handle progress update
    const handleProgressUpdate = useCallback(
        (task: Task, newPercent: number) => {
            if (onTaskUpdate && taskGroup.id) {
                try {
                    // Create updated task with new progress percentage
                    const updatedTask = {
                        ...task,
                        percent: newPercent,
                    };

                    // Call the onTaskUpdate handler with the updated task
                    onTaskUpdate(taskGroup.id, updatedTask);
                } catch (error) {
                    console.error("Error updating task progress:", error);
                }
            }
        },
        [onTaskUpdate, taskGroup.id]
    );

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, []);

    return {
        hoveredTask,
        draggingTask,
        dragType,
        previewTask,
        tooltipPosition,
        initialTaskState,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTaskClick,
        handleTaskMouseEnter,
        handleTaskMouseLeave,
        handleProgressUpdate,
    };
};
