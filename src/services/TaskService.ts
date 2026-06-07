import { Task, ViewMode } from "@/types";
import { isWithinInterval } from "date-fns";
import { TimeScale, snapStart, snapEnd } from "@/core";

export class TaskService {
  /**
   * Calculate the new dates for a task based on pixel position.
   *
   * Delegates to {@link TimeScale} so the inverse mapping is consistent with
   * how tasks are positioned — a drag round-trip can never change a task's
   * duration through accumulated rounding error.
   */
  public static calculateDatesFromPosition(
    left: number,
    width: number,
    startDate: Date,
    endDate: Date,
    totalUnits: number,
    unitWidth: number,
    viewMode: ViewMode = ViewMode.MONTH,
  ): { newStartDate: Date; newEndDate: Date } {
    try {
      const scale = new TimeScale(viewMode, startDate, endDate, unitWidth);
      return this.datesFromPositionWithScale(scale, left, width, viewMode);
    } catch (error) {
      console.error("Error calculating dates from position:", error);
      return {
        newStartDate: new Date(startDate),
        newEndDate: new Date(endDate),
      };
    }
  }

  /** Scale-based variant of {@link calculateDatesFromPosition}. */
  public static datesFromPositionWithScale(
    scale: TimeScale,
    left: number,
    width: number,
    viewMode: ViewMode = ViewMode.MONTH,
    minuteStep = 5,
  ): { newStartDate: Date; newEndDate: Date } {
    const safeLeft = isNaN(left) ? 0 : left;
    const safeWidth = isNaN(width) || width < 1 ? scale.unitWidth : width;

    const rawStart = scale.xToDate(safeLeft);
    // The right edge is exclusive: a bar ending exactly on a column boundary
    // belongs to the column on its left, so nudge inward before snapping.
    const rawEnd = scale.xToDate(safeLeft + safeWidth - 0.001);

    const newStartDate = snapStart(rawStart, viewMode, minuteStep);
    const newEndDate = snapEnd(rawEnd, viewMode, minuteStep);

    return { newStartDate, newEndDate };
  }

  /** Create an updated task with new dates. */
  public static createUpdatedTask(
    task: Task,
    newStartDate: Date,
    newEndDate: Date,
  ): Task {
    return {
      ...task,
      startDate: new Date(newStartDate),
      endDate: new Date(newEndDate),
    };
  }

  /**
   * Calculates position and width for a task in pixels.
   *
   * Builds a {@link TimeScale} internally for backward compatibility. When
   * rendering many tasks, prefer {@link positionTaskWithScale} with a shared
   * scale to avoid rebuilding the column grid per task.
   */
  public static calculateTaskPixelPosition(
    task: Task,
    startDate: Date,
    endDate: Date,
    totalUnits: number,
    unitWidth: number,
    viewMode: ViewMode = ViewMode.MONTH,
  ): { leftPx: number; widthPx: number } {
    try {
      if (
        !(task.startDate instanceof Date) ||
        !(task.endDate instanceof Date)
      ) {
        throw new Error("Invalid dates in task");
      }
      const scale = new TimeScale(viewMode, startDate, endDate, unitWidth);
      return this.positionTaskWithScale(scale, task);
    } catch (error) {
      console.error("Error calculating task position:", error);
      return { leftPx: 0, widthPx: 20 };
    }
  }

  /** Scale-based variant of {@link calculateTaskPixelPosition}. */
  public static positionTaskWithScale(
    scale: TimeScale,
    task: Task,
  ): { leftPx: number; widthPx: number } {
    const minWidthByViewMode: Record<string, number> = {
      [ViewMode.MINUTE]: 10,
      [ViewMode.HOUR]: 15,
      [ViewMode.DAY]: 20,
      [ViewMode.WEEK]: 20,
      [ViewMode.MONTH]: 20,
      [ViewMode.QUARTER]: 30,
      [ViewMode.YEAR]: 40,
    };
    const minWidth = minWidthByViewMode[scale.viewMode] || 20;
    return scale.positionTask(task.startDate, task.endDate, minWidth);
  }

  /** Get live dates from element position during drag. */
  public static getLiveDatesFromElement(
    taskEl: HTMLElement | null,
    startDate: Date,
    endDate: Date,
    totalUnits: number,
    unitWidth: number,
    viewMode: ViewMode = ViewMode.MONTH,
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
        totalUnits,
        unitWidth,
        viewMode,
      );
      return { startDate: newStartDate, endDate: newEndDate };
    } catch (error) {
      console.error("Error getting live dates:", error);
      return { startDate: new Date(startDate), endDate: new Date(endDate) };
    }
  }

  /** Check if two date ranges overlap. */
  public static datesOverlap(
    startA: Date,
    endA: Date,
    startB: Date,
    endB: Date,
  ): boolean {
    return (
      isWithinInterval(startA, { start: startB, end: endB }) ||
      isWithinInterval(endA, { start: startB, end: endB }) ||
      isWithinInterval(startB, { start: startA, end: endA }) ||
      isWithinInterval(endB, { start: startA, end: endA })
    );
  }
}
