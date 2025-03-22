import React from "react";
import { Task } from "@/types";
interface UseAutoScrollProps {
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    draggingTask: Task | null;
    onAutoScrollChange?: (isScrolling: boolean) => void;
    totalMonths: number;
    monthWidth: number;
}
/**
 * Hook for handling auto-scrolling during drag operations
 */
export declare const useAutoScroll: ({ scrollContainerRef, draggingTask, onAutoScrollChange, totalMonths, monthWidth, }: UseAutoScrollProps) => {
    checkForAutoScroll: (clientX: number) => void;
    startAutoScroll: () => void;
    stopAutoScroll: () => void;
    isAutoScrolling: boolean;
};
export {};
