import React, { useRef } from "react";
import { GanttChartProps } from "@/types";
import { GanttHeader } from "./GanttHeader";
import { GanttContent } from "./GanttContent";
import { useGanttTheme } from "./GanttThemeProvider";
import { useTimeUnits } from "./hooks/useTimeUnits";
import { useViewMode } from "./hooks/useViewMode";

/**
 * GanttChart Component
 * A modern, customizable Gantt chart for project timelines
 */
const GanttChart: React.FC<GanttChartProps> = props => {
    const {
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
        viewMode: initialViewMode,
        viewModes,
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
        styles = {},
    } = props;

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // Get theme context
    const { theme, isDarkMode } = useGanttTheme();

    // Use view mode hook for managing the active view
    const { activeViewMode, handleViewModeChange, shouldShowViewModeSelector, availableViewModes } = useViewMode({
        initialViewMode,
        viewModes,
        onViewModeChange,
    });

    // Use time units hook for calculating timeline units
    const { derivedStartDate, derivedEndDate, timeUnits, totalUnits, currentUnitIndex } = useTimeUnits({
        customStartDate,
        customEndDate,
        tasks,
        activeViewMode,
        currentDate,
    });

    // Get the unit width from theme based on view mode
    const unitWidth = theme.sizes.unitWidth[activeViewMode] || 150;

    return (
        <div
            ref={containerRef}
            className={`rmg-gantt-chart w-full border border-gantt-border bg-gantt-bg text-gantt-text rounded-xl shadow-lg overflow-hidden ${
                isDarkMode ? "dark" : ""
            } ${styles.container || ""}`}
            style={
                {
                    fontSize: fontSize || theme.sizes.fontSize,
                    "--gantt-unit-width": `${unitWidth}px`,
                } as React.CSSProperties
            }
            data-testid="gantt-chart">
            {/* Header Section */}
            <GanttHeader
                title={title}
                darkMode={darkMode}
                activeViewMode={activeViewMode}
                onViewModeChange={handleViewModeChange}
                showViewModeSelector={shouldShowViewModeSelector}
                availableViewModes={availableViewModes}
                renderHeader={renderHeader}
                renderViewModeSelector={renderViewModeSelector}
                styles={styles}
            />

            {/* Main Content */}
            <GanttContent
                tasks={tasks}
                startDate={derivedStartDate}
                endDate={derivedEndDate}
                timeUnits={timeUnits}
                totalUnits={totalUnits}
                currentUnitIndex={currentUnitIndex}
                viewMode={activeViewMode}
                editMode={editMode}
                headerLabel={headerLabel}
                showProgress={showProgress}
                showCurrentDateMarker={showCurrentDateMarker}
                todayLabel={todayLabel}
                currentDate={currentDate}
                locale={locale}
                unitWidth={unitWidth}
                smoothDragging={smoothDragging}
                movementThreshold={movementThreshold}
                animationSpeed={animationSpeed}
                rowHeight={rowHeight}
                renderTaskList={renderTaskList}
                renderTask={renderTask}
                renderTooltip={renderTooltip}
                renderTimelineHeader={renderTimelineHeader}
                getTaskColor={getTaskColor}
                onTaskUpdate={onTaskUpdate}
                onTaskClick={onTaskClick}
                onTaskSelect={onTaskSelect}
                onTaskDoubleClick={onTaskDoubleClick}
                onGroupClick={onGroupClick}
                scrollContainerRef={scrollContainerRef}
                styles={styles}
            />
        </div>
    );
};

export default GanttChart;
