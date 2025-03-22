import React, { useRef, useEffect } from "react";
import { TaskRowProps, Task, ViewMode } from "@/types";
import { Tooltip } from "@/components/ui";
import TaskRowContent from "./TaskRowContent";
import { useTaskInteractions } from "./hooks/useTaskInteractions";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { useTaskCollisions } from "./hooks/useTaskCollisions";

/**
 * TaskRow Component - Displays and manages tasks for a single task group
 * This is the main container component that coordinates the hooks and sub-components
 */
const TaskRow: React.FC<TaskRowProps> = ({
    taskGroup,
    startDate,
    endDate,
    totalMonths,
    monthWidth,
    editMode = true,
    showProgress = false,
    className = "",
    tooltipClassName = "",
    onTaskUpdate,
    onTaskClick,
    onTaskSelect,
    onAutoScrollChange,
    viewMode = ViewMode.MONTH,
    scrollContainerRef,
    smoothDragging = true,
    movementThreshold = 3,
    animationSpeed = 0.25,
    renderTask,
    renderTooltip,
    getTaskColor,
}) => {
    // Validate task group data
    if (!taskGroup || !taskGroup.id || !Array.isArray(taskGroup.tasks)) {
        return <div className="relative h-16 text-gantt-text">Invalid task group data</div>;
    }

    // Ensure valid dates
    const validStartDate = startDate instanceof Date ? startDate : new Date();
    const validEndDate = endDate instanceof Date ? endDate : new Date();

    // Generate unique instance ID for this task row
    const instanceId = React.useId ? React.useId() : `task-row-${Math.random().toString(36).substring(2, 11)}`;

    // Reference to the row element for positioning calculations
    const rowRef = useRef<HTMLDivElement>(null);

    // Hook for task interactions (drag, resize, hover)
    const {
        hoveredTask,
        draggingTask,
        dragType,
        previewTask,
        tooltipPosition,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTaskClick,
        handleTaskMouseEnter,
        handleTaskMouseLeave,
        handleProgressUpdate,
    } = useTaskInteractions({
        taskGroup,
        startDate: validStartDate,
        endDate: validEndDate,
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
    });

    // Hook for auto-scrolling during drag operations
    const { checkForAutoScroll } = useAutoScroll({
        scrollContainerRef,
        draggingTask,
        onAutoScrollChange,
        totalMonths,
        monthWidth,
    });

    // Hook for task collisions and layout
    const { taskRows, rowHeight } = useTaskCollisions({
        tasks: taskGroup.tasks,
        previewTask,
        viewMode,
    });

    // Handle mouse move with auto-scroll checking
    const handleMouseMoveWithAutoScroll = (e: React.MouseEvent) => {
        handleMouseMove(e);

        // Check for auto-scrolling when dragging
        if (draggingTask && scrollContainerRef?.current) {
            checkForAutoScroll(e.clientX);
        }
    };

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
        };
    }, [handleMouseUp, handleMouseMove]);

    // Handle empty task groups
    if (!taskGroup.tasks || taskGroup.tasks.length === 0) {
        return <div className="relative h-16 text-gantt-text">No tasks available</div>;
    }

    return (
        <div
            className={`relative border-b border-gray-200 dark:border-gray-700 text-gantt-task-text ${className}`}
            style={{ height: `${rowHeight}px` }}
            onMouseMove={handleMouseMoveWithAutoScroll}
            onMouseLeave={() => handleTaskMouseLeave()}
            ref={rowRef}
            data-testid={`task-row-${taskGroup.id}`}
            data-instance-id={instanceId}>
            {/* Render tasks by row to prevent overlaps */}
            {taskRows.map((rowTasks, rowIndex) => (
                <React.Fragment key={`task-row-${rowIndex}`}>
                    {rowTasks.map(task => {
                        // Skip render if task is invalid
                        if (!task || !task.id || !(task.startDate instanceof Date) || !(task.endDate instanceof Date)) {
                            return null;
                        }

                        try {
                            // Import directly from TaskService for correct positioning
                            const { TaskService } = require("@/services");

                            // Calculate task position
                            const { leftPx, widthPx } = TaskService.calculateTaskPixelPosition(
                                task,
                                validStartDate,
                                validEndDate,
                                totalMonths,
                                monthWidth,
                                viewMode
                            );

                            const isHovered = hoveredTask?.id === task.id;
                            const isDragging = draggingTask?.id === task.id;
                            const topPx = rowIndex * 40 + 10;

                            // Import and use TaskItem directly
                            const TaskItem = require("@/components/task/TaskItem").default;

                            return (
                                <TaskItem
                                    key={`task-${task.id}`}
                                    task={task}
                                    leftPx={leftPx}
                                    widthPx={widthPx}
                                    topPx={topPx}
                                    isHovered={isHovered}
                                    isDragging={isDragging}
                                    editMode={editMode}
                                    showProgress={showProgress}
                                    instanceId={instanceId}
                                    onMouseDown={handleMouseDown}
                                    onMouseEnter={handleTaskMouseEnter}
                                    onMouseLeave={handleTaskMouseLeave}
                                    onClick={handleTaskClick}
                                    renderTask={renderTask}
                                    getTaskColor={getTaskColor}
                                    onProgressUpdate={handleProgressUpdate}
                                />
                            );
                        } catch (error) {
                            console.error("Error rendering task:", error);
                            return null;
                        }
                    })}
                </React.Fragment>
            ))}

            {/* Task tooltip */}
            {(hoveredTask || draggingTask) && (
                <Tooltip
                    task={previewTask || draggingTask || hoveredTask!}
                    position={tooltipPosition}
                    dragType={dragType}
                    taskId={draggingTask?.id}
                    startDate={validStartDate}
                    endDate={validEndDate}
                    totalMonths={totalMonths}
                    monthWidth={monthWidth}
                    showProgress={showProgress}
                    instanceId={instanceId}
                    className={tooltipClassName}
                    viewMode={viewMode}
                    renderTooltip={renderTooltip}
                />
            )}
        </div>
    );
};

export default TaskRow;
