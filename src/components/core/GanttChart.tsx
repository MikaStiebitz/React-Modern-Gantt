import React, { useRef, useState, useEffect } from "react";
import { GanttChartProps, ViewMode, TaskGroup, Task } from "@/types";
import { getMonthsBetween, findEarliestDate, findLatestDate } from "@/utils";
import { Timeline, TodayMarker } from "@/components/timeline";
import { ViewModeSelector } from "@/components/ui";
import { TaskRow, TaskList } from "@/components/task";
import { addDays, addQuarters, startOfQuarter, addYears, startOfYear } from "date-fns";
import { CollisionService } from "@/services/CollisionService";

/**
 * GanttChart Component with ViewMode support
 * A modern, customizable Gantt chart for project timelines
 */
const GanttChart: React.FC<GanttChartProps> = ({
    tasks = [],
    startDate: customStartDate,
    endDate: customEndDate,
    title = "Project Timeline",
    currentDate = new Date(),
    showCurrentDateMarker = true,
    todayLabel = "Today",
    editMode = true,
    headerLabel = "Resources",
    showProgress = false,
    darkMode = false,
    locale = "default",
    styles = {},
    viewMode = ViewMode.MONTH,
    showViewModeSelector = true,
    smoothDragging = true,
    movementThreshold = 3,
    animationSpeed = 0.25,

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
}) => {
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

    // Time unit calculation functions
    const getTimeUnits = () => {
        switch (activeViewMode) {
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
                    date =>
                        Math.floor(date.getMonth() / 3) === todayQuarter && date.getFullYear() === today.getFullYear()
                );
            case ViewMode.YEAR:
                return timeUnits.findIndex(date => date.getFullYear() === today.getFullYear());
            default:
                return -1;
        }
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
                        updatedTask.startDate instanceof Date ? updatedTask.startDate : new Date(updatedTask.startDate),
                    endDate: updatedTask.endDate instanceof Date ? updatedTask.endDate : new Date(updatedTask.endDate),
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

    const handleViewModeChange = (newMode: ViewMode) => {
        setActiveViewMode(newMode);

        // Adjust unit width based on view mode
        switch (newMode) {
            case ViewMode.DAY:
                setViewUnitWidth(50);
                break;
            case ViewMode.WEEK:
                setViewUnitWidth(80);
                break;
            case ViewMode.MONTH:
                setViewUnitWidth(150);
                break;
            case ViewMode.QUARTER:
                setViewUnitWidth(180);
                break;
            case ViewMode.YEAR:
                setViewUnitWidth(200);
                break;
            default:
                setViewUnitWidth(150);
        }

        if (onViewModeChange) {
            onViewModeChange(newMode);
        }
    };

    // Initialize view mode
    useEffect(() => {
        handleViewModeChange(viewMode);
    }, [viewMode]);

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
    const themeClass = darkMode ? "dark" : "";

    // Default styles that can be overridden by props
    const defaultStyles = {
        container: "",
        title: "",
        header: "",
        taskList: "",
        timeline: "",
        taskRow: "",
        todayMarker: "",
        tooltip: "",
    };

    // Merge default styles with provided styles
    const mergedStyles = { ...defaultStyles, ...styles };

    // Custom render function for the header
    const renderHeaderContent = () => {
        if (renderHeader) {
            return renderHeader({
                title,
                darkMode,
                viewMode: activeViewMode,
                onViewModeChange: handleViewModeChange,
                showViewModeSelector,
            });
        }

        return (
            <div className="p-6 border-b border-gantt-border bg-gantt-bg">
                <div className="flex justify-between items-center">
                    <h1 className={`text-2xl font-bold text-gantt-text ${mergedStyles.title}`}>{title}</h1>

                    {showViewModeSelector && (
                        <div className="flex space-x-2">
                            {renderViewModeSelector ? (
                                renderViewModeSelector({
                                    activeMode: activeViewMode,
                                    onChange: handleViewModeChange,
                                    darkMode,
                                    availableModes: [
                                        ViewMode.DAY,
                                        ViewMode.WEEK,
                                        ViewMode.MONTH,
                                        ViewMode.QUARTER,
                                        ViewMode.YEAR,
                                    ],
                                })
                            ) : (
                                <ViewModeSelector
                                    activeMode={activeViewMode}
                                    onChange={handleViewModeChange}
                                    darkMode={darkMode}
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
                className={mergedStyles.timeline}
                viewMode={activeViewMode}
                unitWidth={viewUnitWidth}
            />
        );
    };

    return (
        <div
            ref={containerRef}
            className={`rmg-gantt-chart w-full bg-gantt-bg text-gantt-text rounded-xl shadow-lg overflow-hidden ${themeClass} ${mergedStyles.container}`}
            style={
                {
                    ...style,
                    "--gantt-unit-width": `${viewUnitWidth}px`,
                } as React.CSSProperties
            }
            data-testid="gantt-chart">
            {renderHeaderContent()}

            <div className="relative flex">
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
                        className={mergedStyles.taskList}
                        viewMode={activeViewMode}
                    />
                )}

                <div
                    ref={scrollContainerRef}
                    className={`flex-grow overflow-x-auto rmg-gantt-scroll-container ${
                        isAutoScrolling ? "rmg-auto-scrolling" : ""
                    }`}>
                    <div className="min-w-max">
                        {renderTimelineHeaderContent()}

                        <div className="relative">
                            {showCurrentDateMarker && currentUnitIndex >= 0 && (
                                <TodayMarker
                                    currentMonthIndex={currentUnitIndex}
                                    // Calculate height based on actual row heights including collisions
                                    height={tasks.reduce((total, group) => {
                                        if (!group || !Array.isArray(group.tasks)) return total + 60;
                                        const taskRows = CollisionService.detectOverlaps(group.tasks, activeViewMode);
                                        return total + Math.max(60, taskRows.length * 40 + 20);
                                    }, 0)}
                                    label={todayLabel}
                                    dayOfMonth={currentDate.getDate()}
                                    className={mergedStyles.todayMarker}
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
                                        showProgress={showProgress}
                                        onTaskUpdate={handleTaskUpdate}
                                        onTaskClick={handleTaskClick}
                                        onTaskSelect={handleTaskSelect}
                                        onAutoScrollChange={handleAutoScrollingChange}
                                        className={mergedStyles.taskRow}
                                        tooltipClassName={mergedStyles.tooltip}
                                        viewMode={activeViewMode}
                                        scrollContainerRef={scrollContainerRef}
                                        smoothDragging={smoothDragging}
                                        movementThreshold={movementThreshold}
                                        animationSpeed={animationSpeed}
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
};

export default GanttChart;
