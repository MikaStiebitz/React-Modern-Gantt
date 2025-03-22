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
export declare const useProgressDrag: ({ task, progressBarRef, taskRef, editMode, showProgress, onProgressUpdate, }: UseProgressDragProps) => {
    progressPercent: number;
    isDraggingProgress: boolean;
    handleProgressMouseDown: (e: React.MouseEvent) => void;
    handleProgressClick: (e: React.MouseEvent) => void;
};
export {};
