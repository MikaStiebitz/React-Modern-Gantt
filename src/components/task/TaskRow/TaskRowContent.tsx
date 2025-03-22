import React from "react";
import { TaskGroup, Task, ViewMode } from "@/types";
import { TaskService } from "@/services";
import TaskItem from "@/components/task/TaskItem";

interface TaskRowContentProps {
    taskRows: Task[][];
    taskGroup: TaskGroup;
    startDate: Date;
    endDate: Date;
    totalMonths: number;
    monthWidth: number;
    editMode: boolean;
    showProgress: boolean;
    hoveredTask: Task | null;
    draggingTask: Task | null;
    instanceId: string;
    viewMode: ViewMode | undefined;
    onMouseDown: (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => void;
    onTaskClick: (event: React.MouseEvent, task: Task) => void;
    onMouseEnter: (event: React.MouseEvent, task: Task) => void;
    onMouseLeave: () => void;
    onProgressUpdate: (task: Task, newPercent: number) => void;
    renderTask?: any;
    getTaskColor?: any;
}

/**
 * TaskRowContent Component - Renders the actual tasks in their correct positions
 */
const TaskRowContent: React.FC<TaskRowContentProps> = ({
    taskRows,
    taskGroup,
    startDate,
    endDate,
    totalMonths,
    monthWidth,
    editMode,
    showProgress,
    hoveredTask,
    draggingTask,
    instanceId,
    viewMode,
    onMouseDown,
    onTaskClick,
    onMouseEnter,
    onMouseLeave,
    onProgressUpdate,
    renderTask,
    getTaskColor,
}) => {
    return (
        <>
            {/* Render tasks by row to prevent overlaps */}
            {taskRows.map((rowTasks, rowIndex) => (
                <React.Fragment key={`task-row-${rowIndex}`}>
                    {rowTasks.map(task => {
                        try {
                            if (
                                !task ||
                                !task.id ||
                                !(task.startDate instanceof Date) ||
                                !(task.endDate instanceof Date)
                            ) {
                                console.warn("Invalid task data:", task);
                                return null;
                            }

                            // Calculate task position
                            const { leftPx, widthPx } = TaskService.calculateTaskPixelPosition(
                                task,
                                startDate,
                                endDate,
                                totalMonths,
                                monthWidth,
                                viewMode
                            );

                            const isHovered = hoveredTask?.id === task.id;
                            const isDragging = draggingTask?.id === task.id;
                            const topPx = rowIndex * 40 + 10;

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
                                    onMouseDown={onMouseDown}
                                    onMouseEnter={onMouseEnter}
                                    onMouseLeave={onMouseLeave}
                                    onClick={onTaskClick}
                                    renderTask={renderTask}
                                    getTaskColor={getTaskColor}
                                    onProgressUpdate={onProgressUpdate}
                                />
                            );
                        } catch (error) {
                            console.error("Error rendering task:", error);
                            return null;
                        }
                    })}
                </React.Fragment>
            ))}
        </>
    );
};

export default TaskRowContent;
