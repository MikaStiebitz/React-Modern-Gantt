import { useState, useCallback, useEffect } from "react";
import { Task } from "@/types";

interface UseProgressDragProps {
    task: Task;
    progressBarRef: React.RefObject<HTMLDivElement | null>;
    taskRef: React.RefObject<HTMLDivElement | null>;
    editMode: boolean;
    showProgress: boolean;
    onProgressUpdate?: (task: Task, newPercent: number) => void;
}

/**
 * Hook for handling progress bar dragging
 */
export const useProgressDrag = ({
    task,
    progressBarRef,
    taskRef,
    editMode,
    showProgress,
    onProgressUpdate,
}: UseProgressDragProps) => {
    const [isDraggingProgress, setIsDraggingProgress] = useState(false);
    const [progressPercent, setProgressPercent] = useState(task.percent || 0);

    // Progress bubble drag handlers
    const handleProgressMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (!editMode || !showProgress) return;

            e.stopPropagation();
            e.preventDefault();

            setIsDraggingProgress(true);

            // Apply a smooth transition during drag for better visual feedback
            if (progressBarRef.current) {
                progressBarRef.current.style.transition = "width 0.05s ease-out";
            }

            // Add global event listeners
            document.addEventListener("mousemove", handleProgressMouseMove);
            document.addEventListener("mouseup", handleProgressMouseUp);
        },
        [editMode, showProgress, progressBarRef]
    );

    const handleProgressMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDraggingProgress || !progressBarRef.current || !taskRef.current) return;

            // Get progress bar bounds
            const taskRect = taskRef.current.getBoundingClientRect();

            // Calculate new progress percentage based on mouse position
            const barWidth = taskRect.width - 2; // Account for 1px padding on each side
            const clickX = Math.max(0, Math.min(barWidth, e.clientX - taskRect.left));
            const newPercent = Math.round((clickX / barWidth) * 100);

            // Update progress value with constraints
            setProgressPercent(Math.max(0, Math.min(100, newPercent)));

            // Apply smooth visual update directly to the DOM for immediate feedback
            if (progressBarRef.current && progressBarRef.current.firstChild) {
                (progressBarRef.current.firstChild as HTMLElement).style.width = `${Math.max(
                    0,
                    Math.min(100, newPercent)
                )}%`;
            }
        },
        [isDraggingProgress, progressBarRef, taskRef]
    );

    const handleProgressMouseUp = useCallback(() => {
        if (!isDraggingProgress) return;

        setIsDraggingProgress(false);

        // Remove global event listeners
        document.removeEventListener("mousemove", handleProgressMouseMove);
        document.removeEventListener("mouseup", handleProgressMouseUp);

        // Reset transition after update for normal behavior
        if (progressBarRef.current) {
            progressBarRef.current.style.transition = "";
        }

        // Call update handler with the updated progress
        if (onProgressUpdate && progressPercent !== task.percent) {
            onProgressUpdate(task, progressPercent);
        }
    }, [isDraggingProgress, onProgressUpdate, progressPercent, task, progressBarRef]);

    // Handle progress click for direct updates
    const handleProgressClick = useCallback(
        (e: React.MouseEvent) => {
            if (editMode && showProgress && onProgressUpdate) {
                e.stopPropagation();
                const barWidth = e.currentTarget.clientWidth;
                const clickX = e.nativeEvent.offsetX;
                const newPercent = Math.round((clickX / barWidth) * 100);
                setProgressPercent(newPercent);
                onProgressUpdate(task, newPercent);
            }
        },
        [editMode, showProgress, onProgressUpdate, task]
    );

    // Update progress state when task changes
    useEffect(() => {
        setProgressPercent(task.percent || 0);
    }, [task.percent]);

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleProgressMouseMove);
            document.removeEventListener("mouseup", handleProgressMouseUp);
        };
    }, [handleProgressMouseMove, handleProgressMouseUp]);

    return {
        progressPercent,
        isDraggingProgress,
        handleProgressMouseDown,
        handleProgressClick,
    };
};
