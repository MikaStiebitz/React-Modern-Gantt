import { Task, ViewMode } from '@/types';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export class TaskService {
  /**
   * Calculate the new dates for a task based on pixel position
   */
  public static calculateDatesFromPosition(
    left: number,
    width: number,
    startDate: Date,
    endDate: Date,
    totalUnits: number,
    unitWidth: number,
    viewMode: ViewMode = ViewMode.MONTH
  ): { newStartDate: Date; newEndDate: Date } {
    try {
      // Make sure we're working with valid numbers
      const safeLeft = isNaN(left) ? 0 : left;
      const safeWidth = isNaN(width) || width < 20 ? 20 : width;

      // Calculate the time range of the entire timeline
      const timelineStartTime = startDate.getTime();
      const timelineEndTime = endDate.getTime();
      const timelineDuration = timelineEndTime - timelineStartTime;

      // Calculate milliseconds per pixel
      const msPerPixel = timelineDuration / (totalUnits * unitWidth);

      // Convert pixel position to time offsets
      const startOffset = safeLeft * msPerPixel;
      const durationMs = safeWidth * msPerPixel;

      // Create new Date objects from the calculated times
      let newStartDate = new Date(timelineStartTime + startOffset);
      let newEndDate = new Date(timelineStartTime + startOffset + durationMs);

      // Special handling for different view modes
      switch (viewMode) {
        case ViewMode.MINUTE:
          // Snap to minute boundaries like day view
          const minutesFromStart = Math.round(left / unitWidth);
          const minuteSpan = Math.max(1, Math.round(width / unitWidth));

          const baseMinute = new Date(startDate);
          baseMinute.setSeconds(0, 0);

          newStartDate = new Date(baseMinute);
          newStartDate.setMinutes(baseMinute.getMinutes() + minutesFromStart);
          newStartDate.setSeconds(0, 0);

          newEndDate = new Date(newStartDate);
          newEndDate.setMinutes(newStartDate.getMinutes() + minuteSpan - 1);
          newEndDate.setSeconds(59, 999);
          break;

        case ViewMode.HOUR:
          // Snap to hour boundaries like day view
          const hoursFromStart = Math.round(left / unitWidth);
          const hourSpan = Math.max(1, Math.round(width / unitWidth));

          const baseHour = new Date(startDate);
          baseHour.setMinutes(0, 0, 0);

          newStartDate = new Date(baseHour);
          newStartDate.setHours(baseHour.getHours() + hoursFromStart);
          newStartDate.setMinutes(0, 0, 0);

          newEndDate = new Date(newStartDate);
          newEndDate.setHours(newStartDate.getHours() + hourSpan - 1);
          newEndDate.setMinutes(59, 59, 999);
          break;

        case ViewMode.DAY:
          // Calculate how many units (days) from the start
          const daysFromStart = Math.round(left / unitWidth);

          // Calculate how many days the task spans
          const daySpan = Math.max(1, Math.round(width / unitWidth));

          // Create new dates based on exact day offsets from the start date
          const baseDate = new Date(startDate);
          baseDate.setHours(0, 0, 0, 0);

          // Apply precise day calculations to avoid any off-by-one errors
          newStartDate = new Date(baseDate);
          newStartDate.setDate(baseDate.getDate() + daysFromStart);
          newStartDate.setHours(0, 0, 0, 0);

          newEndDate = new Date(newStartDate);
          newEndDate.setDate(newStartDate.getDate() + daySpan - 1);
          newEndDate.setHours(23, 59, 59, 999);
          break;

        default:
          newStartDate = startOfDay(newStartDate);
          newEndDate = endOfDay(newEndDate);
          break;
      }

      // Ensure dates don't extend beyond the timeline boundaries
      if (newStartDate < startDate) {
        newStartDate = new Date(startDate);
      }

      if (newEndDate > endDate) {
        newEndDate = new Date(endDate);
      }

      return { newStartDate, newEndDate };
    } catch (error) {
      console.error('Error calculating dates from position:', error);
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
    totalUnits: number,
    unitWidth: number,
    viewMode: ViewMode = ViewMode.MONTH
  ): { leftPx: number; widthPx: number } {
    try {
      if (!(task.startDate instanceof Date) || !(task.endDate instanceof Date)) {
        throw new Error('Invalid dates in task');
      }

      // Normalize dates based on view mode for consistent calculations
      let timelineStartTime = startDate.getTime();
      let timelineEndTime = endDate.getTime();
      let taskStartTime = Math.max(task.startDate.getTime(), startDate.getTime());
      let taskEndTime = Math.min(task.endDate.getTime(), endDate.getTime());

      // Apply special handling for view modes
      if (viewMode === ViewMode.MINUTE || viewMode === ViewMode.HOUR || viewMode === ViewMode.DAY) {
        // Ensure consistent boundaries using appropriate precision
        let startPrecision, endPrecision;

        if (viewMode === ViewMode.MINUTE) {
          // No special rounding for minute view
          startPrecision = timelineStartTime;
          endPrecision = timelineEndTime;
        } else if (viewMode === ViewMode.HOUR) {
          // Round to hours
          const startHourTime = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startDate.getHours(),
            0,
            0,
            0
          ).getTime();

          const endHourTime = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            endDate.getHours(),
            59,
            59,
            999
          ).getTime();

          startPrecision = startHourTime;
          endPrecision = endHourTime;
        } else {
          // Round to days for day view
          const startOfDayTime = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            0,
            0,
            0,
            0
          ).getTime();

          const endOfDayTime = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            23,
            59,
            59,
            999
          ).getTime();

          startPrecision = startOfDayTime;
          endPrecision = endOfDayTime;
        }

        timelineStartTime = startPrecision;
        timelineEndTime = endPrecision;

        // Also normalize task times to the appropriate precision
        if (viewMode === ViewMode.DAY) {
          const taskStartDay = new Date(
            new Date(taskStartTime).getFullYear(),
            new Date(taskStartTime).getMonth(),
            new Date(taskStartTime).getDate(),
            0,
            0,
            0,
            0
          ).getTime();

          const taskEndDay = new Date(
            new Date(taskEndTime).getFullYear(),
            new Date(taskEndTime).getMonth(),
            new Date(taskEndTime).getDate(),
            23,
            59,
            59,
            999
          ).getTime();

          taskStartTime = taskStartDay;
          taskEndTime = taskEndDay;
        }
      }

      // Calculate the full timeline range
      const totalTimelineRange = timelineEndTime - timelineStartTime;

      // Convert time differences to pixel positions
      const distanceFromStart = taskStartTime - timelineStartTime;
      const taskDuration = taskEndTime - taskStartTime;

      // Calculate percentages of total timeline
      const leftPercent = distanceFromStart / totalTimelineRange;
      const widthPercent = taskDuration / totalTimelineRange;

      // Calculate pixel positions
      const totalPixelWidth = totalUnits * unitWidth;
      let leftPx = leftPercent * totalPixelWidth;
      let widthPx = widthPercent * totalPixelWidth;

      // Add view mode specific adjustments for alignment
      if (viewMode === ViewMode.MINUTE) {
        // Fine adjustments for minute view
        leftPx = Math.round(leftPx);
        widthPx = Math.max(10, Math.round(widthPx));
      } else if (viewMode === ViewMode.HOUR) {
        // Round to hour boundaries for cleaner display
        leftPx = Math.round(leftPx);
        widthPx = Math.max(15, Math.round(widthPx));
      } else if (viewMode === ViewMode.DAY) {
        // Snap to day boundaries
        leftPx = Math.round(leftPx / unitWidth) * unitWidth;
        widthPx = Math.max(unitWidth, Math.round(widthPx / unitWidth) * unitWidth);
      }

      // Apply view mode specific adjustments for minimum width
      const minWidthByViewMode = {
        [ViewMode.MINUTE]: 10, // Narrower for minute view
        [ViewMode.HOUR]: 15, // Narrow for hour view
        [ViewMode.DAY]: 20,
        [ViewMode.WEEK]: 20,
        [ViewMode.MONTH]: 20,
        [ViewMode.QUARTER]: 30,
        [ViewMode.YEAR]: 40,
      };

      // Ensure minimum width
      const minWidth = minWidthByViewMode[viewMode] || 20;
      widthPx = Math.max(minWidth, widthPx);

      // Ensure not extending beyond timeline
      const maxWidth = totalPixelWidth - leftPx;
      widthPx = Math.min(maxWidth, widthPx);

      return { leftPx, widthPx };
    } catch (error) {
      console.error('Error calculating task position:', error);
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
    totalUnits: number,
    unitWidth: number,
    viewMode: ViewMode = ViewMode.MONTH
  ): { startDate: Date; endDate: Date } {
    try {
      if (!taskEl) {
        return { startDate: new Date(startDate), endDate: new Date(endDate) };
      }

      const left = parseFloat(taskEl.style.left || '0');
      const width = parseFloat(taskEl.style.width || '0');

      const { newStartDate, newEndDate } = this.calculateDatesFromPosition(
        left,
        width,
        startDate,
        endDate,
        totalUnits,
        unitWidth,
        viewMode
      );

      return { startDate: newStartDate, endDate: newEndDate };
    } catch (error) {
      console.error('Error getting live dates:', error);
      return { startDate: new Date(startDate), endDate: new Date(endDate) };
    }
  }

  /**
   * Check if two date ranges overlap
   */
  public static datesOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
    return (
      isWithinInterval(startA, { start: startB, end: endB }) ||
      isWithinInterval(endA, { start: startB, end: endB }) ||
      isWithinInterval(startB, { start: startA, end: endA }) ||
      isWithinInterval(endB, { start: startA, end: endA })
    );
  }
}
