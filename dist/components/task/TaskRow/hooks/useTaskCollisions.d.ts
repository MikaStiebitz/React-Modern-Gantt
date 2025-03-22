import { Task, ViewMode } from "@/types";
interface UseTaskCollisionsProps {
    tasks: Task[];
    previewTask: Task | null;
    viewMode: ViewMode | undefined;
}
/**
 * Hook for detecting and resolving task collisions/overlaps
 */
export declare const useTaskCollisions: ({ tasks, previewTask, viewMode }: UseTaskCollisionsProps) => {
    taskRows: Task[][];
    rowHeight: number;
};
export {};
