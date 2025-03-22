import { useState, useMemo } from "react";
import { TaskGroup, ViewMode } from "@/types";
import { getMonthsBetween, findEarliestDate, findLatestDate } from "@/utils";
import { addDays, addHours, addMinutes, addQuarters, startOfQuarter, addYears, startOfYear } from "date-fns";

interface UseTimeUnitsProps {
    customStartDate?: Date;
    customEndDate?: Date;
    tasks: TaskGroup[];
    activeViewMode: ViewMode;
    currentDate: Date;
    minuteStep?: number;
}

/**
 * Hook for calculating time units based on view mode
 */
export const useTimeUnits = ({
    customStartDate,
    customEndDate,
    tasks,
    activeViewMode,
    currentDate,
    minuteStep = 5,
}: UseTimeUnitsProps) => {
    // Calculate timeline bounds
    const derivedStartDate = useMemo(() => customStartDate || findEarliestDate(tasks), [customStartDate, tasks]);

    const derivedEndDate = useMemo(() => customEndDate || findLatestDate(tasks), [customEndDate, tasks]);

    // Calculate time units based on the view mode
    const timeUnits = useMemo(
        () => getTimeUnits(derivedStartDate, derivedEndDate, activeViewMode, minuteStep),
        [derivedStartDate, derivedEndDate, activeViewMode, minuteStep]
    );

    // Total units for calculations
    const totalUnits = timeUnits.length;

    // Calculate the current unit index (for highlighting today)
    const currentUnitIndex = useMemo(
        () => getCurrentUnitIndex(timeUnits, currentDate, activeViewMode, minuteStep),
        [timeUnits, currentDate, activeViewMode, minuteStep]
    );

    return {
        derivedStartDate,
        derivedEndDate,
        timeUnits,
        totalUnits,
        currentUnitIndex,
    };
};

// Helper function to get time units based on view mode
function getTimeUnits(startDate: Date, endDate: Date, viewMode: ViewMode, minuteStep: number): Date[] {
    switch (viewMode) {
        case ViewMode.MINUTE:
            return getMinutesBetween(startDate, endDate, minuteStep);
        case ViewMode.HOUR:
            return getHoursBetween(startDate, endDate);
        case ViewMode.DAY:
            return getDaysBetween(startDate, endDate);
        case ViewMode.WEEK:
            return getWeeksBetween(startDate, endDate);
        case ViewMode.MONTH:
            return getMonthsBetween(startDate, endDate);
        case ViewMode.QUARTER:
            return getQuartersBetween(startDate, endDate);
        case ViewMode.YEAR:
            return getYearsBetween(startDate, endDate);
        default:
            return getMonthsBetween(startDate, endDate);
    }
}

// Helper function to get minutes between dates with configurable step
function getMinutesBetween(start: Date, end: Date, step: number = 5): Date[] {
    const minutes: Date[] = [];
    let currentDate = new Date(start);
    currentDate.setSeconds(0, 0);

    // Round to nearest minute step
    const currentMinutes = currentDate.getMinutes();
    const roundedMinutes = Math.floor(currentMinutes / step) * step;
    currentDate.setMinutes(roundedMinutes);

    const endDateAdjusted = new Date(end);
    endDateAdjusted.setMinutes(endDateAdjusted.getMinutes(), 59, 999);

    while (currentDate <= endDateAdjusted) {
        minutes.push(new Date(currentDate));
        currentDate = addMinutes(currentDate, step);
    }

    return minutes;
}

// Helper function to get hours between dates
function getHoursBetween(start: Date, end: Date): Date[] {
    const hours: Date[] = [];
    let currentDate = new Date(start);
    currentDate.setMinutes(0, 0, 0);

    const endDateAdjusted = new Date(end);
    endDateAdjusted.setHours(endDateAdjusted.getHours(), 59, 59, 999);

    while (currentDate <= endDateAdjusted) {
        hours.push(new Date(currentDate));
        currentDate = addHours(currentDate, 1);
    }

    return hours;
}

// Helper function to get days between dates
function getDaysBetween(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    let currentDate = new Date(start);
    currentDate.setHours(0, 0, 0, 0);

    const endDateAdjusted = new Date(end);
    endDateAdjusted.setHours(23, 59, 59, 999);

    while (currentDate <= endDateAdjusted) {
        days.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return days;
}

// Helper function to get weeks between dates
function getWeeksBetween(start: Date, end: Date): Date[] {
    const weeks: Date[] = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
        weeks.push(new Date(currentDate));
        currentDate = addDays(currentDate, 7);
    }

    return weeks;
}

// Helper function to get quarters between dates
function getQuartersBetween(start: Date, end: Date): Date[] {
    const quarters: Date[] = [];
    let currentDate = startOfQuarter(new Date(start));

    while (currentDate <= end) {
        quarters.push(new Date(currentDate));
        currentDate = addQuarters(currentDate, 1);
    }

    return quarters;
}

// Helper function to get years between dates
function getYearsBetween(start: Date, end: Date): Date[] {
    const years: Date[] = [];
    let currentDate = startOfYear(new Date(start));

    while (currentDate <= end) {
        years.push(new Date(currentDate));
        currentDate = addYears(currentDate, 1);
    }

    return years;
}

// Helper function to find current unit index for highlighting
function getCurrentUnitIndex(timeUnits: Date[], currentDate: Date, viewMode: ViewMode, minuteStep: number): number {
    const today = new Date(currentDate);

    switch (viewMode) {
        case ViewMode.MINUTE:
            return timeUnits.findIndex(
                date =>
                    date.getHours() === today.getHours() &&
                    Math.floor(date.getMinutes() / minuteStep) === Math.floor(today.getMinutes() / minuteStep) &&
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
            );

        case ViewMode.HOUR:
            return timeUnits.findIndex(
                date =>
                    date.getHours() === today.getHours() &&
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
            );

        case ViewMode.DAY:
            return timeUnits.findIndex(
                date =>
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
            );

        case ViewMode.WEEK:
            return timeUnits.findIndex(date => {
                const weekEndDate = new Date(date);
                weekEndDate.setDate(date.getDate() + 6);
                return today >= date && today <= weekEndDate;
            });

        case ViewMode.MONTH:
            return timeUnits.findIndex(
                date => date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
            );

        case ViewMode.QUARTER:
            const todayQuarter = Math.floor(today.getMonth() / 3);
            return timeUnits.findIndex(
                date => Math.floor(date.getMonth() / 3) === todayQuarter && date.getFullYear() === today.getFullYear()
            );

        case ViewMode.YEAR:
            return timeUnits.findIndex(date => date.getFullYear() === today.getFullYear());

        default:
            return -1;
    }
}
