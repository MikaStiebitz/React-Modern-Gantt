import React from "react";
import { Task } from "@/types";
interface TaskItemContentProps {
    task: Task;
    getTaskColor?: any;
    isHovered: boolean;
    isDragging: boolean;
}
/**
 * TaskItemContent Component - Renders the content of a task item
 */
declare const TaskItemContent: React.FC<TaskItemContentProps>;
export default TaskItemContent;
