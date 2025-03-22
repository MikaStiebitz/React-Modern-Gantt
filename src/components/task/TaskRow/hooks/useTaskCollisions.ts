import React, { useMemo } from "react";
import { Task, ViewMode } from "@/types";
import { CollisionService } from "@/services";

interface UseTaskCollisionsProps {
    tasks: Task[];
    previewTask: Task | null;
    viewMode: ViewMode;
}

/**
 * Hook for detecting and resolving task collisions/overlaps
 */
export const useTaskCollisions = ({ tasks, previewTask, viewMode }: UseTaskCollisionsProps) => {
    // Calculate task rows with collision detection
    const taskRows = useMemo(() => {
        return previewTask
            ? CollisionService.getPreviewArrangement(previewTask, tasks, viewMode)
            : CollisionService.detectOverlaps(tasks, viewMode);
    }, [tasks, previewTask, viewMode]);

    // Calculate row height based on task arrangement
    const rowHeight = useMemo(() => {
        return Math.max(60, taskRows.length * 40 + 20);
    }, [taskRows.length]);

    return {
        taskRows,
        rowHeight,
    };
};
