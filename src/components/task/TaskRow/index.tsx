import React from "react";
import { TaskRowProps } from "@/types";
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
    viewMode,
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
    const instanceId = React.useId();

    // Reference to the row element for positioning calculations
    const rowRef = React.useRef<HTMLDivElement>(null);

    // Hook for task interactions (drag, resize, hover)
    const {
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
    React.useEffect(() => {
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
            {/* TaskRowContent renders the actual tasks */}
            <TaskRowContent
                taskRows={taskRows}
                taskGroup={taskGroup}
                startDate={validStartDate}
                endDate={validEndDate}
                totalMonths={totalMonths}
                monthWidth={monthWidth}
                editMode={editMode}
                showProgress={showProgress}
                hoveredTask={hoveredTask}
                draggingTask={draggingTask}
                onMouseDown={handleMouseDown}
                onTaskClick={handleTaskClick}
                onMouseEnter={handleTaskMouseEnter}
                onMouseLeave={handleTaskMouseLeave}
                onProgressUpdate={handleProgressUpdate}
                instanceId={instanceId}
                viewMode={viewMode}
                renderTask={renderTask}
                getTaskColor={getTaskColor}
            />

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
