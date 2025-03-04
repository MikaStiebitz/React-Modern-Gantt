import { Task } from "../models";

/**
 * Manages operations on tasks like calculating positions, dates, etc.
 */
export class TaskManager {
    /**
     * Calculate the new dates for a task based on pixel position
     */
    public static calculateDatesFromPosition(
        left: number,
        width: number,
        startDate: Date,
        endDate: Date,
        totalMonths: number,
        monthWidth: number
    ): { newStartDate: Date; newEndDate: Date } {
        try {
            // Make sure we're working with valid numbers
            const safeLeft = isNaN(left) ? 0 : left;
            const safeWidth = isNaN(width) || width < 20 ? 20 : width;

            // Convert pixel position to date
            const timelineStartTime = startDate.getTime();
            const timelineEndTime = endDate.getTime();
            const timelineDuration = timelineEndTime - timelineStartTime;
            const msPerPixel = timelineDuration / (totalMonths * monthWidth);

            const startOffset = safeLeft * msPerPixel;
            const durationMs = safeWidth * msPerPixel;

            // Calculate new dates
            const newStartDate = new Date(timelineStartTime + startOffset);
            const newEndDate = new Date(timelineStartTime + startOffset + durationMs);

            return { newStartDate, newEndDate };
        } catch (error) {
            console.error("Error calculating dates from position:", error);
            return {
                newStartDate: new Date(startDate),
                newEndDate: new Date(endDate),
            };
        }
    }

    /**
     * Create an updated task with new dates
     */
    public static createUpdatedTask(task: Task, newStartDate: Date, newEndDate: Date): Task {
        // Create a clean copy with all original properties
        return {
            ...task,
            startDate: new Date(newStartDate),
            endDate: new Date(newEndDate),
        };
    }

    /**
     * Calculates position and width for a task in pixels
     */
    public static calculateTaskPixelPosition(
        task: Task,
        startDate: Date,
        endDate: Date,
        totalMonths: number,
        monthWidth: number
    ): { leftPx: number; widthPx: number } {
        try {
            // Ensure we have valid dates
            if (!(task.startDate instanceof Date) || !(task.endDate instanceof Date)) {
                throw new Error("Invalid dates in task");
            }

            // Calculate task position
            const taskStartTime = task.startDate.getTime();
            const taskEndTime = task.endDate.getTime();
            const timelineStartTime = startDate.getTime();
            const timelineEndTime = endDate.getTime();
            const timelineDuration = timelineEndTime - timelineStartTime;

            // Calculate percentages
            const startOffsetPercent = ((taskStartTime - timelineStartTime) / timelineDuration) * 100;
            const taskDurationPercent = ((taskEndTime - taskStartTime) / timelineDuration) * 100;

            // Convert to pixels
            const leftPx = (startOffsetPercent / 100) * totalMonths * monthWidth;
            const widthPx = Math.max(20, (taskDurationPercent / 100) * totalMonths * monthWidth);

            return { leftPx, widthPx };
        } catch (error) {
            console.error("Error calculating task position:", error, task);
            // Return a default position as fallback
            return { leftPx: 0, widthPx: 20 };
        }
    }

    /**
     * Get live dates from element position during drag
     */
    public static getLiveDatesFromElement(
        taskEl: HTMLElement | null,
        startDate: Date,
        endDate: Date,
        totalMonths: number,
        monthWidth: number
    ): { startDate: Date; endDate: Date } {
        try {
            if (!taskEl) {
                return { startDate: new Date(startDate), endDate: new Date(endDate) };
            }

            const left = parseFloat(taskEl.style.left || "0");
            const width = parseFloat(taskEl.style.width || "0");

            const { newStartDate, newEndDate } = this.calculateDatesFromPosition(
                left,
                width,
                startDate,
                endDate,
                totalMonths,
                monthWidth
            );

            return { startDate: newStartDate, endDate: newEndDate };
        } catch (error) {
            console.error("Error getting live dates:", error);
            return { startDate: new Date(startDate), endDate: new Date(endDate) };
        }
    }

    /**
     * Format a date for display
     */
    public static formatDate(date: Date): string {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return "Invalid date";
        }
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    /**
     * Calculate duration between dates in days
     */
    public static getDuration(start: Date, end: Date): number {
        try {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } catch (error) {
            console.error("Error calculating duration:", error);
            return 0;
        }
    }
}
