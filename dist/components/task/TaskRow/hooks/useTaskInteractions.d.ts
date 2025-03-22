import { Task, TaskGroup, ViewMode } from "@/types";
interface UseTaskInteractionsProps {
    taskGroup: TaskGroup;
    startDate: Date;
    endDate: Date;
    editMode: boolean;
    viewMode: ViewMode | undefined;
    monthWidth: number;
    totalMonths: number;
    onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
    onTaskClick?: (task: Task, group: TaskGroup) => void;
    onTaskSelect?: (task: Task, isSelected: boolean) => void;
    rowRef: React.RefObject<HTMLDivElement | null>;
    instanceId: string;
    smoothDragging: boolean;
    movementThreshold: number;
    animationSpeed: number;
}
/**
 * Hook for managing task interactions (drag, resize, hover)
 */
export declare const useTaskInteractions: ({ taskGroup, startDate, endDate, editMode, viewMode, monthWidth, totalMonths, onTaskUpdate, onTaskClick, onTaskSelect, rowRef, instanceId, smoothDragging, movementThreshold, animationSpeed, }: UseTaskInteractionsProps) => {
    hoveredTask: Task | null;
    draggingTask: Task | null;
    dragType: "move" | "resize-left" | "resize-right" | null;
    previewTask: Task | null;
    tooltipPosition: {
        x: number;
        y: number;
    };
    initialTaskState: {
        left: number;
        width: number;
        startDate: Date;
        endDate: Date;
    } | null;
    handleMouseDown: (event: React.MouseEvent, task: Task, type: "move" | "resize-left" | "resize-right") => void;
    handleMouseMove: (e: React.MouseEvent | MouseEvent) => void;
    handleMouseUp: () => void;
    handleTaskClick: (event: React.MouseEvent, task: Task) => void;
    handleTaskMouseEnter: (event: React.MouseEvent, task: Task) => void;
    handleTaskMouseLeave: () => void;
    handleProgressUpdate: (task: Task, newPercent: number) => void;
};
export {};
