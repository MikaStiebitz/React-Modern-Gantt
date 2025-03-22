import React, { useRef, useCallback, useEffect } from "react";
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
export const useAutoScroll = ({
    scrollContainerRef,
    draggingTask,
    onAutoScrollChange,
    totalMonths,
    monthWidth,
}: UseAutoScrollProps) => {
    // Auto-scrolling refs
    const autoScrollActive = useRef<boolean>(false);
    const autoScrollTimerRef = useRef<number | null>(null);
    const autoScrollSpeedRef = useRef<number>(0);
    const autoScrollDirectionRef = useRef<"left" | "right" | null>(null);
    const timelineLimitsRef = useRef<{ minLeft: number; maxLeft: number }>({
        minLeft: 0,
        maxLeft: totalMonths * monthWidth,
    });

    // Check if auto-scroll is needed based on mouse position
    const checkForAutoScroll = useCallback(
        (clientX: number) => {
            if (!scrollContainerRef?.current || !draggingTask) return;

            const container = scrollContainerRef.current;
            const containerRect = container.getBoundingClientRect();

            // Define the edge threshold area (in pixels) to trigger auto-scrolling
            const edgeThreshold = 40;

            // Reset auto-scroll direction
            let direction: "left" | "right" | null = null;
            let scrollSpeed = 0;

            // Check if mouse is near the left edge
            if (clientX < containerRect.left + edgeThreshold) {
                direction = "left";
                // Calculate scroll speed based on proximity to edge (closer = faster)
                scrollSpeed = Math.max(1, Math.round((edgeThreshold - (clientX - containerRect.left)) / 10));
            }
            // Check if mouse is near the right edge
            else if (clientX > containerRect.right - edgeThreshold) {
                direction = "right";
                // Calculate scroll speed based on proximity to edge (closer = faster)
                scrollSpeed = Math.max(1, Math.round((clientX - (containerRect.right - edgeThreshold)) / 10));
            }

            // Update refs with current auto-scroll state
            autoScrollDirectionRef.current = direction;
            autoScrollSpeedRef.current = scrollSpeed;

            // Start or stop auto-scrolling based on direction
            if (direction && !autoScrollActive.current) {
                startAutoScroll();
                if (onAutoScrollChange) onAutoScrollChange(true);
            } else if (!direction && autoScrollActive.current) {
                stopAutoScroll();
                if (onAutoScrollChange) onAutoScrollChange(false);
            }
        },
        [scrollContainerRef, draggingTask, onAutoScrollChange]
    );

    // Start auto-scrolling
    const startAutoScroll = useCallback(() => {
        if (autoScrollActive.current) return;

        autoScrollActive.current = true;

        // Use requestAnimationFrame for smoother scrolling
        const doScroll = () => {
            if (!autoScrollActive.current || !scrollContainerRef?.current) return;

            const container = scrollContainerRef.current;
            const direction = autoScrollDirectionRef.current;
            const speed = autoScrollSpeedRef.current;

            // Get current scroll position
            const currentScrollLeft = container.scrollLeft;
            // Get maximum scroll position
            const maxScrollLeft = container.scrollWidth - container.clientWidth;

            if (direction === "left") {
                // Don't scroll past the beginning
                if (currentScrollLeft <= 0) {
                    stopAutoScroll();
                    return;
                }

                const newScrollLeft = Math.max(0, currentScrollLeft - speed);
                container.scrollLeft = newScrollLeft;
            } else if (direction === "right") {
                // Don't scroll past the end
                if (currentScrollLeft >= maxScrollLeft) {
                    stopAutoScroll();
                    return;
                }

                const newScrollLeft = Math.min(maxScrollLeft, currentScrollLeft + speed);
                container.scrollLeft = newScrollLeft;
            }

            // Continue scrolling if active
            if (autoScrollActive.current) {
                autoScrollTimerRef.current = requestAnimationFrame(doScroll);
            }
        };

        autoScrollTimerRef.current = requestAnimationFrame(doScroll);
    }, [scrollContainerRef]);

    // Stop auto-scrolling
    const stopAutoScroll = useCallback(() => {
        autoScrollActive.current = false;
        if (autoScrollTimerRef.current !== null) {
            cancelAnimationFrame(autoScrollTimerRef.current);
            autoScrollTimerRef.current = null;
        }
        if (onAutoScrollChange) onAutoScrollChange(false);
    }, [onAutoScrollChange]);

    // Update timeline limits when dimensions change
    useEffect(() => {
        timelineLimitsRef.current = {
            minLeft: 0,
            maxLeft: totalMonths * monthWidth,
        };
    }, [totalMonths, monthWidth]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            stopAutoScroll();
        };
    }, [stopAutoScroll]);

    return {
        checkForAutoScroll,
        startAutoScroll,
        stopAutoScroll,
        isAutoScrolling: autoScrollActive.current,
    };
};
