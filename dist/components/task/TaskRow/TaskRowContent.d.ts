import React from "react";
import { TaskGroup, Task, ViewMode } from "@/types";
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
    viewMode: ViewMode;
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
declare const TaskRowContent: React.FC<TaskRowContentProps>;
export default TaskRowContent;
