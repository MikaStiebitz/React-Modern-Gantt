import React from "react";
import { TaskListProps } from "@/types";
/**
 * TaskListVirtualized Component - Optimized for large datasets
 * Only renders visible task groups using virtualization
 */
declare const TaskListVirtualized: React.FC<TaskListProps & {
    containerHeight?: number;
}>;
export default TaskListVirtualized;
