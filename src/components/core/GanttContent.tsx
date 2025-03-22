import React from "react";
import { TaskGroup, ViewMode } from "@/types";
import { Timeline, TodayMarker } from "@/components/timeline";
import { TaskRow, TaskList } from "@/components/task";
import { CollisionService } from "@/services/CollisionService";

interface GanttContentProps {
    tasks: TaskGroup[];
    startDate: Date;
    endDate: Date;
    timeUnits: Date[];
    totalUnits: number;
    currentUnitIndex: number;
    viewMode: ViewMode;
    editMode: boolean;
    headerLabel: string;
    showProgress: boolean;
    showCurrentDateMarker: boolean;
    todayLabel: string;
    currentDate: Date;
    locale: string;
    unitWidth: number;
    smoothDragging: boolean;
    movementThreshold: number;
    animationSpeed: number;
    rowHeight: number;
    renderTaskList?: any;
    renderTask?: any;
    renderTooltip?: any;
    renderTimelineHeader?: any;
    getTaskColor?: any;
    onTaskUpdate?: (groupId: string, updatedTask: any) => void;
    onTaskClick?: (task: any, group: TaskGroup) => void;
    onTaskSelect?: (task: any, isSelected: boolean) => void;
    onTaskDoubleClick?: (task: any) => void;
    onGroupClick?: (group: TaskGroup) => void;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    styles: any;
}

/**
 * GanttContent Component - Renders the main content area of the Gantt chart
 */
export const GanttContent: React.FC<GanttContentProps> = ({
    tasks,
    startDate,
    endDate,
    timeUnits,
    totalUnits,
    currentUnitIndex,
    viewMode,
    editMode,
    headerLabel,
    showProgress,
    showCurrentDateMarker,
    todayLabel,
    currentDate,
    locale,
    unitWidth,
    smoothDragging,
    movementThreshold,
    animationSpeed,
    rowHeight,
    renderTaskList,
    renderTask,
    renderTooltip,
    renderTimelineHeader,
    getTaskColor,
    onTaskUpdate,
    onTaskClick,
    onTaskSelect,
    onTaskDoubleClick,
    onGroupClick,
    scrollContainerRef,
    styles,
}) => {
    // State for auto-scrolling
    const [isAutoScrolling, setIsAutoScrolling] = React.useState<boolean>(false);

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

    // Custom render function for the timeline header
    const renderTimelineHeaderContent = () => {
        if (renderTimelineHeader) {
            return renderTimelineHeader({
                timeUnits,
                currentUnitIndex,
                viewMode,
                locale,
                unitWidth,
            });
        }

        return (
            <Timeline
                months={timeUnits}
                currentMonthIndex={currentUnitIndex}
                locale={locale}
                className={styles.timeline || ""}
                viewMode={viewMode}
                unitWidth={unitWidth}
            />
        );
    };

    return (
        <div className="relative flex">
            {/* Task List */}
            {renderTaskList ? (
                renderTaskList({
                    tasks,
                    headerLabel,
                    onGroupClick,
                    viewMode,
                })
            ) : (
                <TaskList
                    tasks={tasks}
                    headerLabel={headerLabel}
                    onGroupClick={onGroupClick}
                    className={styles.taskList || ""}
                    viewMode={viewMode}
                />
            )}

            {/* Timeline and Tasks */}
            <div
                ref={scrollContainerRef}
                className={`flex-grow overflow-x-auto rmg-gantt-scroll-container ${
                    isAutoScrolling ? "rmg-auto-scrolling" : ""
                }`}>
                <div className="min-w-max">
                    {/* Timeline Header */}
                    {renderTimelineHeaderContent()}

                    {/* Tasks Container */}
                    <div className="relative">
                        {/* Today Marker */}
                        {showCurrentDateMarker && currentUnitIndex >= 0 && (
                            <TodayMarker
                                currentMonthIndex={currentUnitIndex}
                                // Calculate height based on actual row heights including collisions
                                height={tasks.reduce((total, group) => {
                                    if (!group || !Array.isArray(group.tasks)) return total + 60;
                                    const taskRows = CollisionService.detectOverlaps(group.tasks, viewMode);
                                    return total + Math.max(60, taskRows.length * rowHeight + 20);
                                }, 0)}
                                label={todayLabel}
                                dayOfMonth={currentDate.getDate()}
                                className={styles.todayMarker || ""}
                                viewMode={viewMode}
                                unitWidth={unitWidth}
                            />
                        )}

                        {/* Task Rows */}
                        {tasks.map(group => {
                            if (!group || !group.id) return null;

                            return (
                                <TaskRow
                                    key={`task-row-${group.id}`}
                                    taskGroup={group}
                                    startDate={startDate}
                                    endDate={endDate}
                                    totalMonths={totalUnits}
                                    monthWidth={unitWidth}
                                    editMode={editMode}
                                    showProgress={showProgress}
                                    onTaskUpdate={onTaskUpdate}
                                    onTaskClick={onTaskClick}
                                    onTaskSelect={onTaskSelect}
                                    onAutoScrollChange={handleAutoScrollingChange}
                                    className={styles.taskRow || ""}
                                    tooltipClassName={styles.tooltip || ""}
                                    viewMode={viewMode}
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
    );
};
