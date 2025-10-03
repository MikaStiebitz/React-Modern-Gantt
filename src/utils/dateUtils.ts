import { DateDisplayFormat, ViewMode } from '../types';
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInQuarters,
  differenceInYears,
  format,
} from 'date-fns';

/**
 * Formats a date to display just the month
 */
export function formatMonth(date: Date, locale = 'default'): string {
  return date.toLocaleString(locale, { month: 'short' });
}

/**
 * Returns standard day markers for a month
 */
export function getStandardDayMarkers(): number[] {
  return [1, 8, 15, 22, 29];
}

/**
 * Format date according to specified format
 */
export function formatDate(
  date: Date,
  format: DateDisplayFormat = DateDisplayFormat.FULL_DATE,
  locale = 'default'
): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  switch (format) {
    case DateDisplayFormat.MONTH_YEAR:
      return date.toLocaleString(locale, { month: 'short', year: '2-digit' });
    case DateDisplayFormat.SHORT_DATE:
      return date.toLocaleString(locale, { month: 'short', day: 'numeric' });
    case DateDisplayFormat.FULL_DATE:
    default:
      return date.toLocaleString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

/**
 * Gets an array of months between two dates
 */
export function getMonthsBetween(startDate: Date, endDate: Date): Date[] {
  const months: Date[] = [];

  if (
    !(startDate instanceof Date) ||
    !(endDate instanceof Date) ||
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime())
  ) {
    return [];
  }

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  for (let year = startYear; year <= endYear; year++) {
    const monthStart = year === startYear ? startMonth : 0;
    const monthEnd = year === endYear ? endMonth : 11;

    for (let month = monthStart; month <= monthEnd; month++) {
      months.push(new Date(year, month, 1));
    }
  }

  return months;
}

/**
 * Get days in a specific month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Calculate the duration between two dates
 */
export function getDuration(
  start: Date,
  end: Date,
  viewMode: ViewMode = ViewMode.MONTH
): { value: number; unit: string } {
  try {
    if (!(start instanceof Date) || !(end instanceof Date) || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { value: 0, unit: 'days' };
    }

    const earlierDate = start < end ? start : end;
    const laterDate = start < end ? end : start;

    switch (viewMode) {
      case ViewMode.MINUTE:
        const diffMinutes = Math.round((laterDate.getTime() - earlierDate.getTime()) / (1000 * 60));
        return { value: diffMinutes, unit: diffMinutes === 1 ? 'minute' : 'minutes' };

      case ViewMode.HOUR:
        const diffHours = Math.round((laterDate.getTime() - earlierDate.getTime()) / (1000 * 60 * 60));
        return { value: diffHours, unit: diffHours === 1 ? 'hour' : 'hours' };

      case ViewMode.DAY:
        const days = differenceInDays(laterDate, earlierDate) + 1;
        return { value: days, unit: days === 1 ? 'day' : 'days' };

      case ViewMode.WEEK:
        const weeks = differenceInWeeks(laterDate, earlierDate) + 1;
        return { value: weeks, unit: weeks === 1 ? 'week' : 'weeks' };

      case ViewMode.MONTH:
        const months = differenceInMonths(laterDate, earlierDate) + 1;
        return { value: months, unit: months === 1 ? 'month' : 'months' };

      case ViewMode.QUARTER:
        const quarters = differenceInQuarters(laterDate, earlierDate) + 1;
        return { value: quarters, unit: quarters === 1 ? 'quarter' : 'quarters' };

      case ViewMode.YEAR:
        const years = differenceInYears(laterDate, earlierDate) + 1;
        return { value: years, unit: years === 1 ? 'year' : 'years' };

      default:
        const defaultDays = differenceInDays(laterDate, earlierDate) + 1;
        return { value: defaultDays, unit: defaultDays === 1 ? 'day' : 'days' };
    }
  } catch (error) {
    console.error('Error calculating duration:', error);
    return { value: 0, unit: 'days' };
  }
}

/**
 * Formats a date range as a string
 */
export function formatDateRange(startDate: Date, endDate: Date, locale = 'default'): string {
  if (
    !(startDate instanceof Date) ||
    !(endDate instanceof Date) ||
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime())
  ) {
    return 'Invalid date range';
  }

  const start = formatDate(startDate, DateDisplayFormat.SHORT_DATE, locale);
  const end = formatDate(endDate, DateDisplayFormat.SHORT_DATE, locale);

  return `${start} - ${end}`;
}

/**
 * Calculate the duration in days between two dates
 */
export function calculateDuration(startDate: Date, endDate: Date): number {
  if (
    !(startDate instanceof Date) ||
    !(endDate instanceof Date) ||
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime())
  ) {
    return 0;
  }

  // Handle dates in the wrong order
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
