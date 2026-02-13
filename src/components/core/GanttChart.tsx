import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
    GanttChartProps,
    ViewMode,
    TaskGroup,
    Task,
    GanttChartRef,
    ExportOptions,
    ExportResult,
    ExportFormat,
} from "@/types";
import { getMonthsBetween, findEarliestDate, findLatestDate } from "@/utils";
import { Timeline, TodayMarker } from "@/components/timeline";
import { ViewModeSelector } from "@/components/ui";
import { TaskRow, TaskList } from "@/components/task";
import { ExportService } from "@/services/ExportService";
import { addDays, addHours, addMinutes, addQuarters, startOfQuarter, addYears, startOfYear } from "date-fns";
import { CollisionService } from "@/services/CollisionService";

/**
 * GanttChart Component with ViewMode support and Export functionality
 * A modern, customizable Gantt chart for project timelines
 */
const GanttChart = forwardRef<GanttChartRef, GanttChartProps>(
    (
        {
            tasks = [],
            startDate: customStartDate,
            endDate: customEndDate,
            title = "Project Timeline",
            currentDate = new Date(),
            showCurrentDateMarker = true,
            todayLabel = "Today",
            editMode = true, // Global master switch - default true
            allowProgressEdit = true, // Default true
            allowTaskResize = true, // Default true
            allowTaskMove = true, // Default true
            headerLabel = "Resources",
            showProgress = false,
            darkMode = false,
            locale = "default",
            styles = {},
            viewMode = ViewMode.MONTH,
            viewModes, // Array of allowed view modes or false to hide
            smoothDragging = true,
            movementThreshold = 3,
            animationSpeed = 0.25,
            minuteStep = 5, // Default to 5-minute intervals
            infiniteScroll = false,
            onTimelineExtend,
            focusMode = true,

            // Custom rendering functions
            renderTaskList,
            renderTask,
            renderTooltip,
            renderViewModeSelector,
            renderHeader,
            renderTimelineHeader,
            getTaskColor,

            // Event handlers
            onTaskUpdate,
            onTaskClick,
            onTaskSelect,
            onTaskDoubleClick,
            onGroupClick,
            onViewModeChange,

            // Visual customization
            fontSize,
            rowHeight = 40,
            timeStep,
        },
        ref,
    ) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const scrollContainerRef = useRef<HTMLDivElement | null>(null);
        const [activeViewMode, setActiveViewMode] = useState<ViewMode>(viewMode);
        const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
        const [viewUnitWidth, setViewUnitWidth] = useState<number>(150);
        const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);

        // Add a forceRender counter to trigger re-renders when tasks update
        const [forceRender, setForceRender] = useState<number>(0);

        // Calculate timeline bounds
        const derivedStartDate = customStartDate || findEarliestDate(tasks);
        const derivedEndDate = customEndDate || findLatestDate(tasks);

        // Expose export methods via ref
        useImperativeHandle(
            ref,
            () => ({
                exportChart: async (options?: ExportOptions): Promise<ExportResult> => {
                    if (!containerRef.current) {
                        return {
                            success: false,
                            error: "Container element not available",
                        };
                    }
                    return ExportService.export(containerRef.current, {
                        ...options,
                        backgroundColor: darkMode ? "#1f2937" : options?.backgroundColor || "#ffffff",
                    });
                },

                getDataUrl: async (
                    format?: ExportFormat,
                    options?: Omit<ExportOptions, "format" | "filename">,
                ): Promise<string | null> => {
                    if (!containerRef.current) return null;
                    return ExportService.getDataUrl(containerRef.current, format, {
                        ...options,
                        backgroundColor: darkMode ? "#1f2937" : options?.backgroundColor || "#ffffff",
                    });
                },

                getBlob: async (
                    format?: ExportFormat,
                    options?: Omit<ExportOptions, "format" | "filename">,
                ): Promise<Blob | null> => {
                    if (!containerRef.current) return null;
                    return ExportService.getBlob(containerRef.current, format, {
                        ...options,
                        backgroundColor: darkMode ? "#1f2937" : options?.backgroundColor || "#ffffff",
                    });
                },

                copyToClipboard: async (options?: Omit<ExportOptions, "format" | "filename">): Promise<boolean> => {
                    if (!containerRef.current) return false;
                    return ExportService.copyToClipboard(containerRef.current, {
                        ...options,
                        backgroundColor: darkMode ? "#1f2937" : options?.backgroundColor || "#ffffff",
                    });
                },

                getContainerElement: (): HTMLDivElement | null => {
                    return containerRef.current;
                },

                scrollToDate: (date: Date): void => {
                    if (!scrollContainerRef.current) return;

                    const timeUnitsArray = getTimeUnitsForMode(activeViewMode);
                    const targetIndex = findDateIndex(date, timeUnitsArray, activeViewMode);

                    if (targetIndex >= 0) {
                        const scrollPosition = targetIndex * viewUnitWidth;
                        scrollContainerRef.current.scrollLeft =
                            scrollPosition - scrollContainerRef.current.clientWidth / 2;
                    }
                },

                scrollToToday: (): void => {
                    scrollToNow(activeViewMode, viewUnitWidth);
                },
            }),
            [darkMode, activeViewMode, viewUnitWidth],
        );

        // Helper to find date index in time units
        const findDateIndex = (date: Date, timeUnits: Date[], mode: ViewMode): number => {
            switch (mode) {
                case ViewMode.MINUTE:
                    return timeUnits.findIndex(
                        d =>
                            d.getHours() === date.getHours() &&
                            Math.floor(d.getMinutes() / (minuteStep || 5)) ===
                                Math.floor(date.getMinutes() / (minuteStep || 5)) &&
                            d.getDate() === date.getDate() &&
                            d.getMonth() === date.getMonth() &&
                            d.getFullYear() === date.getFullYear(),
                    );
                case ViewMode.HOUR:
                    return timeUnits.findIndex(
                        d =>
                            d.getHours() === date.getHours() &&
                            d.getDate() === date.getDate() &&
                            d.getMonth() === date.getMonth() &&
                            d.getFullYear() === date.getFullYear(),
                    );
                case ViewMode.DAY:
                    return timeUnits.findIndex(
                        d =>
                            d.getDate() === date.getDate() &&
                            d.getMonth() === date.getMonth() &&
                            d.getFullYear() === date.getFullYear(),
                    );
                case ViewMode.WEEK:
                    return timeUnits.findIndex(d => {
                        const weekEndDate = new Date(d);
                        weekEndDate.setDate(d.getDate() + 6);
                        return date >= d && date <= weekEndDate;
                    });
                case ViewMode.MONTH:
                    return timeUnits.findIndex(
                        d => d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(),
                    );
                case ViewMode.QUARTER:
                    const dateQuarter = Math.floor(date.getMonth() / 3);
                    return timeUnits.findIndex(
                        d => Math.floor(d.getMonth() / 3) === dateQuarter && d.getFullYear() === date.getFullYear(),
                    );
                case ViewMode.YEAR:
                    return timeUnits.findIndex(d => d.getFullYear() === date.getFullYear());
                default:
                    return -1;
            }
        };

        // NEW: Infinite scroll - extend timeline when needed
        const handleTimelineExtension = (direction: "left" | "right") => {
            if (!infiniteScroll || !onTimelineExtend) return;

            const extensionAmount = getExtensionAmount(activeViewMode);
            let newStartDate = derivedStartDate;
            let newEndDate = derivedEndDate;

            if (direction === "left") {
                newStartDate = subtractTimeUnits(derivedStartDate, extensionAmount, activeViewMode);
            } else {
                newEndDate = addTimeUnits(derivedEndDate, extensionAmount, activeViewMode);
            }

            onTimelineExtend(direction, newStartDate, newEndDate);
        };

        // Helper to get extension amount based on view mode
        const getExtensionAmount = (mode: ViewMode): number => {
            switch (mode) {
                case ViewMode.MINUTE:
                    return 60; // Add 1 hour
                case ViewMode.HOUR:
                    return 24; // Add 1 day
                case ViewMode.DAY:
                    return 7; // Add 1 week
                case ViewMode.WEEK:
                    return 4; // Add 1 month
                case ViewMode.MONTH:
                    return 3; // Add 3 months
                case ViewMode.QUARTER:
                    return 4; // Add 1 year
                case ViewMode.YEAR:
                    return 5; // Add 5 years
                default:
                    return 3;
            }
        };

        // Helper to add time units
        const addTimeUnits = (date: Date, amount: number, mode: ViewMode): Date => {
            switch (mode) {
                case ViewMode.MINUTE:
                    return addMinutes(date, amount);
                case ViewMode.HOUR:
                    return addHours(date, amount);
                case ViewMode.DAY:
                    return addDays(date, amount);
                case ViewMode.WEEK:
                    return addDays(date, amount * 7);
                case ViewMode.MONTH:
                    return new Date(date.getFullYear(), date.getMonth() + amount, date.getDate());
                case ViewMode.QUARTER:
                    return addQuarters(date, amount);
                case ViewMode.YEAR:
                    return addYears(date, amount);
                default:
                    return date;
            }
        };

        // Helper to subtract time units
        const subtractTimeUnits = (date: Date, amount: number, mode: ViewMode): Date => {
            switch (mode) {
                case ViewMode.MINUTE:
                    return addMinutes(date, -amount);
                case ViewMode.HOUR:
                    return addHours(date, -amount);
                case ViewMode.DAY:
                    return addDays(date, -amount);
                case ViewMode.WEEK:
                    return addDays(date, -amount * 7);
                case ViewMode.MONTH:
                    return new Date(date.getFullYear(), date.getMonth() - amount, date.getDate());
                case ViewMode.QUARTER:
                    return addQuarters(date, -amount);
                case ViewMode.YEAR:
                    return addYears(date, -amount);
                default:
                    return date;
            }
        };

        // Time unit calculation functions
        const getTimeUnits = () => {
            switch (activeViewMode) {
                case ViewMode.MINUTE:
                    return getMinutesBetween(derivedStartDate, derivedEndDate, minuteStep);
                case ViewMode.HOUR:
                    return getHoursBetween(derivedStartDate, derivedEndDate);
                case ViewMode.DAY:
                    return getDaysBetween(derivedStartDate, derivedEndDate);
                case ViewMode.WEEK:
                    return getWeeksBetween(derivedStartDate, derivedEndDate);
                case ViewMode.MONTH:
                    return getMonthsBetween(derivedStartDate, derivedEndDate);
                case ViewMode.QUARTER:
                    return getQuartersBetween(derivedStartDate, derivedEndDate);
                case ViewMode.YEAR:
                    return getYearsBetween(derivedStartDate, derivedEndDate);
                default:
                    return getMonthsBetween(derivedStartDate, derivedEndDate);
            }
        };

        // Get minutes between dates with configurable step - OPTIMIZED for performance
        const getMinutesBetween = (start: Date, end: Date, step: number = 5): Date[] => {
            const minutes: Date[] = [];
            let currentDate = new Date(start);
            currentDate.setSeconds(0, 0);

            // Round to nearest minute step
            const currentMinutes = currentDate.getMinutes();
            const roundedMinutes = Math.floor(currentMinutes / step) * step;
            currentDate.setMinutes(roundedMinutes);

            const endDateAdjusted = new Date(end);
            endDateAdjusted.setMinutes(endDateAdjusted.getMinutes(), 59, 999);

            // PERFORMANCE: Limit minute view to max 500 intervals to prevent lag
            const maxIntervals = 500;
            let intervalCount = 0;

            while (currentDate <= endDateAdjusted && intervalCount < maxIntervals) {
                minutes.push(new Date(currentDate));
                currentDate = addMinutes(currentDate, step);
                intervalCount++;
            }

            // If we hit the limit, warn and show reduced view
            if (intervalCount >= maxIntervals) {
                console.warn(
                    `Minute view limited to ${maxIntervals} intervals for performance. ` +
                        `Consider using a larger time range or switching to Hour view.`,
                );
            }

            return minutes;
        };

        // Get hours between dates
        const getHoursBetween = (start: Date, end: Date): Date[] => {
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
        };

        // Get days between dates
        const getDaysBetween = (start: Date, end: Date): Date[] => {
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
        };

        // Get weeks between dates
        const getWeeksBetween = (start: Date, end: Date): Date[] => {
            const weeks: Date[] = [];
            let currentDate = new Date(start);

            while (currentDate <= end) {
                weeks.push(new Date(currentDate));
                currentDate = addDays(currentDate, 7);
            }

            return weeks;
        };

        // Get quarters between dates
        const getQuartersBetween = (start: Date, end: Date): Date[] => {
            const quarters: Date[] = [];
            let currentDate = startOfQuarter(new Date(start));

            while (currentDate <= end) {
                quarters.push(new Date(currentDate));
                currentDate = addQuarters(currentDate, 1);
            }

            return quarters;
        };

        // Get years between dates
        const getYearsBetween = (start: Date, end: Date): Date[] => {
            const years: Date[] = [];
            let currentDate = startOfYear(new Date(start));

            while (currentDate <= end) {
                years.push(new Date(currentDate));
                currentDate = addYears(currentDate, 1);
            }

            return years;
        };

        // Find current unit index for highlighting
        const getCurrentUnitIndex = (): number => {
            const today = new Date();

            switch (activeViewMode) {
                case ViewMode.MINUTE:
                    return timeUnits.findIndex(
                        date =>
                            date.getHours() === today.getHours() &&
                            Math.floor(date.getMinutes() / (minuteStep || 5)) ===
                                Math.floor(today.getMinutes() / (minuteStep || 5)) &&
                            date.getDate() === today.getDate() &&
                            date.getMonth() === today.getMonth() &&
                            date.getFullYear() === today.getFullYear(),
                    );
                case ViewMode.HOUR:
                    return timeUnits.findIndex(
                        date =>
                            date.getHours() === today.getHours() &&
                            date.getDate() === today.getDate() &&
                            date.getMonth() === today.getMonth() &&
                            date.getFullYear() === today.getFullYear(),
                    );
                case ViewMode.DAY:
                    return timeUnits.findIndex(
                        date =>
                            date.getDate() === today.getDate() &&
                            date.getMonth() === today.getMonth() &&
                            date.getFullYear() === today.getFullYear(),
                    );
                case ViewMode.WEEK:
                    return timeUnits.findIndex(date => {
                        const weekEndDate = new Date(date);
                        weekEndDate.setDate(date.getDate() + 6);
                        return today >= date && today <= weekEndDate;
                    });
                case ViewMode.MONTH:
                    return timeUnits.findIndex(
                        date => date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear(),
                    );
                case ViewMode.QUARTER:
                    const todayQuarter = Math.floor(today.getMonth() / 3);
                    return timeUnits.findIndex(
                        date =>
                            Math.floor(date.getMonth() / 3) === todayQuarter &&
                            date.getFullYear() === today.getFullYear(),
                    );
                case ViewMode.YEAR:
                    return timeUnits.findIndex(date => date.getFullYear() === today.getFullYear());
                default:
                    return -1;
            }
        };

        // Get available view modes based on props
        const getAvailableViewModes = (): ViewMode[] | false => {
            // If viewModes is explicitly set to false, return false to hide selector
            if (viewModes === false) {
                return false;
            }

            // If viewModes is provided as an array, use it
            if (Array.isArray(viewModes)) {
                return viewModes;
            }

            // Default standard view modes
            return [ViewMode.DAY, ViewMode.WEEK, ViewMode.MONTH, ViewMode.QUARTER, ViewMode.YEAR];
        };

        // Get time units and calculate current unit index
        const timeUnits = getTimeUnits();
        const totalUnits = timeUnits.length;
        const currentUnitIndex = getCurrentUnitIndex();

        // Handle auto-scrolling state
        const handleAutoScrollingChange = (isScrolling: boolean) => {
            setIsAutoScrolling(isScrolling);
            if (scrollContainerRef.current) {
                if (isScrolling) {
                    scrollContainerRef.current.classList.add("rmg-auto-scrolling");
                } else {
                    scrollContainerRef.current.classList.remove("rmg-auto-scrolling");
                }
            }
        };

        // Task interaction handlers
        const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
            if (onTaskUpdate) {
                try {
                    const ensuredTask = {
                        ...updatedTask,
                        startDate:
                            updatedTask.startDate instanceof Date
                                ? updatedTask.startDate
                                : new Date(updatedTask.startDate),
                        endDate:
                            updatedTask.endDate instanceof Date ? updatedTask.endDate : new Date(updatedTask.endDate),
                    };

                    // Force a re-render to update collision detection
                    setForceRender(prev => prev + 1);

                    onTaskUpdate(groupId, ensuredTask);
                } catch (error) {
                    console.error("Error in handleTaskUpdate:", error);
                }
            }
        };

        const handleTaskClick = (task: Task, group: TaskGroup) => {
            if (onTaskClick) {
                try {
                    onTaskClick(task, group);
                } catch (error) {
                    console.error("Error in handleTaskClick:", error);
                }
            }
        };

        const handleTaskSelect = (task: Task, isSelected: boolean) => {
            setSelectedTaskIds(prev => {
                if (isSelected) {
                    return [...prev, task.id];
                } else {
                    return prev.filter(id => id !== task.id);
                }
            });

            if (onTaskSelect) {
                try {
                    onTaskSelect(task, isSelected);
                } catch (error) {
                    console.error("Error in onTaskSelect handler:", error);
                }
            }
        };

        // Calculate scroll position to center "now" in view
        const calculateScrollToNow = (mode: ViewMode, unitWidth: number, timeUnitsArray: Date[]): number => {
            if (!scrollContainerRef.current || timeUnitsArray.length === 0) return 0;

            const container = scrollContainerRef.current;
            const today = new Date();

            // Find the current unit index directly from timeUnits
            let currentIndex = -1;
            switch (mode) {
                case ViewMode.MINUTE:
                    currentIndex = timeUnitsArray.findIndex(
                        date =>
                            date.getHours() === today.getHours() &&
                            Math.floor(date.getMinutes() / (minuteStep || 5)) ===
                                Math.floor(today.getMinutes() / (minuteStep || 5)) &&
                            date.getDate() === today.getDate() &&
                            date.getMonth() === today.getMonth() &&
                            date.getFullYear() === today.getFullYear(),
                    );
                    break;
                case ViewMode.HOUR:
                    currentIndex = timeUnitsArray.findIndex(
                        date =>
                            date.getHours() === today.getHours() &&
                            date.getDate() === today.getDate() &&
                            date.getMonth() === today.getMonth() &&
                            date.getFullYear() === today.getFullYear(),
                    );
                    break;
                case ViewMode.DAY:
                    currentIndex = timeUnitsArray.findIndex(
                        date =>
                            date.getDate() === today.getDate() &&
                            date.getMonth() === today.getMonth() &&
                            date.getFullYear() === today.getFullYear(),
                    );
                    break;
                case ViewMode.WEEK:
                    currentIndex = timeUnitsArray.findIndex(date => {
                        const weekEndDate = new Date(date);
                        weekEndDate.setDate(date.getDate() + 6);
                        return today >= date && today <= weekEndDate;
                    });
                    break;
                case ViewMode.MONTH:
                    currentIndex = timeUnitsArray.findIndex(
                        date => date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear(),
                    );
                    break;
                case ViewMode.QUARTER:
                    const todayQuarter = Math.floor(today.getMonth() / 3);
                    currentIndex = timeUnitsArray.findIndex(
                        date =>
                            Math.floor(date.getMonth() / 3) === todayQuarter &&
                            date.getFullYear() === today.getFullYear(),
                    );
                    break;
                case ViewMode.YEAR:
                    currentIndex = timeUnitsArray.findIndex(date => date.getFullYear() === today.getFullYear());
                    break;
            }

            if (currentIndex < 0) return 0;

            // Calculate the position of "now" marker
            let nowPosition = 0;

            switch (mode) {
                case ViewMode.MINUTE: {
                    const minuteOfHour = today.getMinutes();
                    const secondOfMinute = today.getSeconds();
                    const minutePosition = (minuteOfHour + secondOfMinute / 60) / 60;
                    nowPosition = currentIndex * unitWidth + unitWidth * minutePosition;
                    break;
                }
                case ViewMode.HOUR: {
                    const minuteOfCurrentHour = today.getMinutes();
                    const hourPosition = minuteOfCurrentHour / 60;
                    nowPosition = currentIndex * unitWidth + unitWidth * hourPosition;
                    break;
                }
                case ViewMode.DAY:
                    nowPosition = currentIndex * unitWidth + unitWidth / 2;
                    break;
                case ViewMode.WEEK: {
                    const dayOfWeek = today.getDay();
                    const normalizedDayOfWeek = (dayOfWeek + 7) % 7;
                    const dayPosition = normalizedDayOfWeek / 6;
                    nowPosition = currentIndex * unitWidth + unitWidth * dayPosition;
                    break;
                }
                case ViewMode.MONTH: {
                    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                    const dayPercentage = (today.getDate() - 1) / daysInMonth;
                    nowPosition = currentIndex * unitWidth + unitWidth * dayPercentage;
                    break;
                }
                case ViewMode.QUARTER: {
                    const monthOfQuarter = today.getMonth() % 3;
                    const monthPosition = monthOfQuarter / 3;
                    nowPosition = currentIndex * unitWidth + unitWidth * monthPosition;
                    break;
                }
                case ViewMode.YEAR: {
                    const monthOfYear = today.getMonth();
                    const yearMonthPosition = monthOfYear / 12;
                    nowPosition = currentIndex * unitWidth + unitWidth * yearMonthPosition;
                    break;
                }
                default:
                    nowPosition = currentIndex * unitWidth + unitWidth / 2;
            }

            // Center the "now" position in the viewport
            const containerWidth = container.clientWidth;
            const scrollPosition = nowPosition - containerWidth / 2;

            // Ensure we don't scroll beyond boundaries
            const maxScroll = container.scrollWidth - containerWidth;
            return Math.max(0, Math.min(maxScroll, scrollPosition));
        };

        // Helper to get time units for a specific view mode (used for scroll calculations)
        const getTimeUnitsForMode = (mode: ViewMode): Date[] => {
            switch (mode) {
                case ViewMode.MINUTE:
                    return getMinutesBetween(derivedStartDate, derivedEndDate, minuteStep);
                case ViewMode.HOUR:
                    return getHoursBetween(derivedStartDate, derivedEndDate);
                case ViewMode.DAY:
                    return getDaysBetween(derivedStartDate, derivedEndDate);
                case ViewMode.WEEK:
                    return getWeeksBetween(derivedStartDate, derivedEndDate);
                case ViewMode.MONTH:
                    return getMonthsBetween(derivedStartDate, derivedEndDate);
                case ViewMode.QUARTER:
                    return getQuartersBetween(derivedStartDate, derivedEndDate);
                case ViewMode.YEAR:
                    return getYearsBetween(derivedStartDate, derivedEndDate);
                default:
                    return getMonthsBetween(derivedStartDate, derivedEndDate);
            }
        };

        // Smooth scroll to "now" position
        const scrollToNow = (mode: ViewMode, unitWidth: number) => {
            if (!scrollContainerRef.current) {
                return;
            }

            // Calculate timeUnits for the NEW mode directly (don't rely on state)
            const newTimeUnits = getTimeUnitsForMode(mode);
            const targetScroll = calculateScrollToNow(mode, unitWidth, newTimeUnits);
            const container = scrollContainerRef.current;

            // Use smooth scroll behavior
            container.style.scrollBehavior = "smooth";
            container.scrollLeft = targetScroll;

            // Reset scroll behavior after animation completes
            setTimeout(() => {
                if (container) {
                    container.style.scrollBehavior = "";
                }
            }, 500);
        };

        const handleViewModeChange = (newMode: ViewMode) => {
            // Adjust unit width based on view mode
            let newUnitWidth = 150;
            switch (newMode) {
                case ViewMode.MINUTE:
                    newUnitWidth = 60; // Wider for better visibility
                    break;
                case ViewMode.HOUR:
                    newUnitWidth = 80; // Wider for better visibility
                    break;
                case ViewMode.DAY:
                    newUnitWidth = 50;
                    break;
                case ViewMode.WEEK:
                    newUnitWidth = 80;
                    break;
                case ViewMode.MONTH:
                    newUnitWidth = 150;
                    break;
                case ViewMode.QUARTER:
                    newUnitWidth = 180;
                    break;
                case ViewMode.YEAR:
                    newUnitWidth = 200;
                    break;
                default:
                    newUnitWidth = 150;
            }

            setActiveViewMode(newMode);
            setViewUnitWidth(newUnitWidth);

            if (onViewModeChange) {
                onViewModeChange(newMode);
            }

            // Scroll to "now" if focus mode is enabled
            // Use requestAnimationFrame and setTimeout to ensure DOM has fully updated with new view mode
            if (focusMode) {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        scrollToNow(newMode, newUnitWidth);
                    }, 100);
                });
            }
        };

        // Initialize view mode
        useEffect(() => {
            handleViewModeChange(viewMode);
        }, [viewMode]);

        // Scroll to "now" when focus mode is initially enabled
        useEffect(() => {
            if (focusMode && scrollContainerRef.current) {
                // Use a small delay to ensure DOM has updated after initial render
                const timeoutId = setTimeout(() => {
                    scrollToNow(activeViewMode, viewUnitWidth);
                }, 300);
                return () => clearTimeout(timeoutId);
            }
        }, [focusMode]);

        // Apply custom animation speed to CSS variables
        useEffect(() => {
            if (containerRef.current) {
                const speedValue = Math.max(0.1, Math.min(1, animationSpeed || 0.25));
                containerRef.current.style.setProperty("--rmg-animation-speed", speedValue.toString());
            }
        }, [animationSpeed, containerRef.current]);

        const style: React.CSSProperties = {
            fontSize: fontSize || "inherit",
        };

        // Apply dark mode class if enabled
        const themeClass = darkMode ? "rmg-dark" : "";

        // Merge custom styles with component class names
        const getComponentClassName = (component: string, defaultClass: string) => {
            return `${defaultClass} ${styles[component as keyof typeof styles] || ""}`;
        };

        // Determine if we should show the view mode selector
        const shouldShowViewModeSelector = getAvailableViewModes() !== false;

        // Custom render function for the header
        const renderHeaderContent = () => {
            if (renderHeader) {
                return renderHeader({
                    title,
                    darkMode,
                    viewMode: activeViewMode,
                    onViewModeChange: handleViewModeChange,
                    showViewModeSelector: shouldShowViewModeSelector,
                });
            }

            return (
                <div className="rmg-header">
                    <div className="rmg-header-content">
                        <h1 className={getComponentClassName("title", "rmg-title")}>{title}</h1>

                        {shouldShowViewModeSelector && (
                            <div className="rmg-view-mode-wrapper">
                                {renderViewModeSelector ? (
                                    renderViewModeSelector({
                                        activeMode: activeViewMode,
                                        onChange: handleViewModeChange,
                                        darkMode,
                                        availableModes: getAvailableViewModes() as ViewMode[],
                                    })
                                ) : (
                                    <ViewModeSelector
                                        activeMode={activeViewMode}
                                        onChange={handleViewModeChange}
                                        darkMode={darkMode}
                                        availableModes={getAvailableViewModes() as ViewMode[]}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        // Custom render function for the timeline header
        const renderTimelineHeaderContent = () => {
            if (renderTimelineHeader) {
                return renderTimelineHeader({
                    timeUnits,
                    currentUnitIndex: currentUnitIndex,
                    viewMode: activeViewMode,
                    locale,
                    unitWidth: viewUnitWidth,
                });
            }

            return (
                <Timeline
                    months={timeUnits}
                    currentMonthIndex={currentUnitIndex}
                    locale={locale}
                    className={getComponentClassName("timeline", "rmg-timeline")}
                    viewMode={activeViewMode}
                    unitWidth={viewUnitWidth}
                />
            );
        };

        return (
            <div
                ref={containerRef}
                className={`rmg-gantt-chart ${themeClass} ${getComponentClassName("container", "")}`}
                style={
                    {
                        ...style,
                        "--gantt-unit-width": `${viewUnitWidth}px`,
                    } as React.CSSProperties
                }
                data-testid="gantt-chart"
                data-rmg-component="gantt-chart"
                data-view-mode={activeViewMode}>
                {renderHeaderContent()}

                <div className="rmg-container" data-rmg-component="container">
                    {renderTaskList ? (
                        renderTaskList({
                            tasks,
                            headerLabel,
                            onGroupClick,
                            viewMode: activeViewMode,
                        })
                    ) : (
                        <TaskList
                            tasks={tasks}
                            headerLabel={headerLabel}
                            onGroupClick={onGroupClick}
                            className={getComponentClassName("taskList", "rmg-task-list")}
                            viewMode={activeViewMode}
                        />
                    )}

                    <div
                        ref={scrollContainerRef}
                        className={`rmg-timeline-container ${isAutoScrolling ? "rmg-auto-scrolling" : ""}`}
                        data-rmg-component="timeline-container">
                        <div className="rmg-timeline-content" data-rmg-component="timeline-content">
                            {renderTimelineHeaderContent()}

                            <div
                                className="rmg-timeline-grid"
                                data-rmg-component="timeline-grid"
                                data-view-mode={activeViewMode}>
                                {showCurrentDateMarker && currentUnitIndex >= 0 && (
                                    <TodayMarker
                                        currentMonthIndex={currentUnitIndex}
                                        // Calculate height based on actual row heights including collisions
                                        height={tasks.reduce((total, group) => {
                                            if (!group || !Array.isArray(group.tasks)) return total + 60;
                                            const taskRows = CollisionService.detectOverlaps(
                                                group.tasks,
                                                activeViewMode,
                                            );
                                            return total + Math.max(60, taskRows.length * 40 + 20);
                                        }, 0)}
                                        label={todayLabel}
                                        dayOfMonth={currentDate.getDate()}
                                        className={getComponentClassName("todayMarker", "rmg-today-marker")}
                                        viewMode={activeViewMode}
                                        unitWidth={viewUnitWidth}
                                    />
                                )}

                                {tasks.map(group => {
                                    if (!group || !group.id) return null;

                                    return (
                                        <TaskRow
                                            key={`task-row-${group.id}-${forceRender}`}
                                            taskGroup={group}
                                            startDate={derivedStartDate}
                                            endDate={derivedEndDate}
                                            totalMonths={totalUnits}
                                            monthWidth={viewUnitWidth}
                                            editMode={editMode}
                                            allowProgressEdit={allowProgressEdit}
                                            allowTaskResize={allowTaskResize}
                                            allowTaskMove={allowTaskMove}
                                            showProgress={showProgress}
                                            onTaskUpdate={handleTaskUpdate}
                                            onTaskClick={handleTaskClick}
                                            onTaskSelect={handleTaskSelect}
                                            onAutoScrollChange={handleAutoScrollingChange}
                                            className={getComponentClassName("taskRow", "rmg-task-row")}
                                            tooltipClassName={getComponentClassName("tooltip", "rmg-tooltip")}
                                            viewMode={activeViewMode}
                                            scrollContainerRef={scrollContainerRef}
                                            smoothDragging={smoothDragging}
                                            movementThreshold={movementThreshold}
                                            animationSpeed={animationSpeed}
                                            infiniteScroll={infiniteScroll}
                                            onTimelineExtend={handleTimelineExtension}
                                            renderTask={renderTask}
                                            renderTooltip={renderTooltip}
                                            getTaskColor={getTaskColor}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);

GanttChart.displayName = "GanttChart";

export default GanttChart;
