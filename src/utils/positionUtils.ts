import { Task } from '@/types';
import { getMonthsBetween } from './dateUtils';

/**
 * Calculates the position and width of a task in percentage
 */
export function calculateTaskPosition(
  task: Task,
  startDate: Date,
  endDate: Date
): {
  left: string;
  width: string;
} {
  // Ensure valid dates
  if (
    !(task.startDate instanceof Date) ||
    !(task.endDate instanceof Date) ||
    isNaN(task.startDate.getTime()) ||
    isNaN(task.endDate.getTime())
  ) {
    return { left: '0%', width: '10%' };
  }

  // Normalize dates to first day of month
  const timelineStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const timelineEnd = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0); // Last day of end month

  // Calculate total months
  const months = getMonthsBetween(timelineStart, timelineEnd);
  const totalMonths = months.length;

  // Calculate task start position
  const taskStartYear = task.startDate.getFullYear();
  const taskStartMonth = task.startDate.getMonth();
  const taskStartMonthIndex = months.findIndex(
    date => date.getFullYear() === taskStartYear && date.getMonth() === taskStartMonth
  );

  // If task starts before timeline, clamp to timeline start
  const adjustedStartIndex = taskStartMonthIndex < 0 ? 0 : taskStartMonthIndex;

  // Calculate task end position
  const taskEndYear = task.endDate.getFullYear();
  const taskEndMonth = task.endDate.getMonth();
  const taskEndMonthIndex = months.findIndex(
    date => date.getFullYear() === taskEndYear && date.getMonth() === taskEndMonth
  );

  // If task ends after timeline, clamp to timeline end
  const adjustedEndIndex = taskEndMonthIndex < 0 ? months.length - 1 : taskEndMonthIndex;

  // Calculate percentage positions
  // Add 1 to width to make tasks include their full end month
  const leftPercent = (adjustedStartIndex / totalMonths) * 100;
  const widthPercent = ((adjustedEndIndex - adjustedStartIndex + 1) / totalMonths) * 100;

  return {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
  };
}
