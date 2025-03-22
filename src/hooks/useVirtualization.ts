import { useState, useEffect, useRef, useMemo } from "react";
import { TaskGroup } from "@/types";

interface UseVirtualizationProps {
    tasks: TaskGroup[];
    rowHeight: number;
    containerHeight: number;
    scrollTop: number;
    buffer?: number; // Additional rows to render above/below viewport
}

/**
 * Hook for virtualizing large task lists
 * Only renders task groups that are visible in the viewport plus a buffer
 */
export const useVirtualization = ({
    tasks,
    rowHeight,
    containerHeight,
    scrollTop,
    buffer = 5, // Default buffer of 5 rows
}: UseVirtualizationProps) => {
    // Calculate visible rows
    const visibleRows = useMemo(() => {
        // Skip if no tasks or invalid dimensions
        if (!Array.isArray(tasks) || containerHeight <= 0 || rowHeight <= 0) {
            return { visibleTasks: tasks, startIndex: 0, endIndex: tasks.length - 1 };
        }

        // Calculate which rows are visible
        const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
        const visibleCount = Math.ceil(containerHeight / rowHeight) + 2 * buffer;
        const endIndex = Math.min(tasks.length - 1, startIndex + visibleCount);

        // Get visible task groups
        const visibleTasks = tasks.slice(startIndex, endIndex + 1);

        // Calculate total height and offsets for proper positioning
        const totalHeight = tasks.length * rowHeight;
        const topOffset = startIndex * rowHeight;

        return {
            visibleTasks,
            startIndex,
            endIndex,
            topOffset,
            totalHeight,
        };
    }, [tasks, rowHeight, containerHeight, scrollTop, buffer]);

    return visibleRows;
};
