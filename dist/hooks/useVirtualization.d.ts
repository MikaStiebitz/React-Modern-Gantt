import { TaskGroup } from "@/types";
interface UseVirtualizationProps {
    tasks: TaskGroup[];
    rowHeight: number;
    containerHeight: number;
    scrollTop: number;
    buffer?: number;
}
/**
 * Hook for virtualizing large task lists
 * Only renders task groups that are visible in the viewport plus a buffer
 */
export declare const useVirtualization: ({ tasks, rowHeight, containerHeight, scrollTop, buffer, }: UseVirtualizationProps) => {
    visibleTasks: TaskGroup[];
    startIndex: number;
    endIndex: number;
    topOffset?: undefined;
    totalHeight?: undefined;
} | {
    visibleTasks: TaskGroup[];
    startIndex: number;
    endIndex: number;
    topOffset: number;
    totalHeight: number;
};
export {};
