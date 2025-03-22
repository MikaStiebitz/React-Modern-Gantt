import React, { useRef, useState, useEffect } from "react";
import { TaskGroup, ViewMode, TaskListProps } from "@/types";
import { useVirtualization } from "@/hooks/useVirtualization";

/**
 * TaskListVirtualized Component - Optimized for large datasets
 * Only renders visible task groups using virtualization
 */
const TaskListVirtualized: React.FC<TaskListProps & { containerHeight?: number }> = ({
    tasks = [],
    headerLabel = "Resources",
    showIcon = false,
    showTaskCount = false,
    showDescription = true,
    rowHeight = 40,
    className = "",
    onGroupClick,
    viewMode,
    containerHeight = 600, // Default height, can be overridden
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    // Handle scroll events
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    // Use virtualization hook
    const { visibleTasks, topOffset, totalHeight } = useVirtualization({
        tasks,
        rowHeight,
        containerHeight,
        scrollTop,
    });

    // Determine if we need an adjustment for hierarchical timeline header
    const needsHierarchicalDisplay = viewMode === ViewMode.DAY || viewMode === ViewMode.WEEK;

    return (
        <div
            className={`rmg-task-list w-40 flex-shrink-0 z-10 bg-gantt-bg shadow-sm ${className}`}
            style={{ height: containerHeight }}>
            {/* Header */}
            {needsHierarchicalDisplay ? (
                <>
                    <div className="p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10 sticky top-0 z-10 bg-gantt-bg"></div>
                    <div className="p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10 sticky top-10 z-10 bg-gantt-bg">
                        {headerLabel}
                    </div>
                </>
            ) : (
                <div className="p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10 sticky top-0 z-10 bg-gantt-bg">
                    {headerLabel}
                </div>
            )}

            {/* Virtualized task list */}
            <div
                ref={containerRef}
                className="overflow-y-auto"
                style={{ height: `calc(100% - ${needsHierarchicalDisplay ? 80 : 40}px)` }}
                onScroll={handleScroll}>
                {/* Spacer div to maintain scroll height */}
                <div style={{ height: totalHeight }}>
                    {/* Visible tasks with correct positioning */}
                    <div style={{ position: "absolute", top: topOffset, width: "100%" }}>
                        {visibleTasks.map(taskGroup => {
                            if (!taskGroup) return null;

                            return (
                                <div
                                    key={`task-group-${taskGroup.id || "unknown"}`}
                                    className="p-2 border-r border-b border-gray-200 dark:border-gray-700 font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                    style={{ height: `${rowHeight}px` }}
                                    onClick={() => onGroupClick && onGroupClick(taskGroup)}
                                    data-testid={`task-group-${taskGroup.id || "unknown"}`}>
                                    <div className="flex items-center">
                                        {showIcon && taskGroup.icon && (
                                            <span
                                                className="mr-2"
                                                dangerouslySetInnerHTML={{ __html: taskGroup.icon }}
                                            />
                                        )}
                                        <div className="font-medium truncate">{taskGroup.name || "Unnamed"}</div>
                                    </div>

                                    {showDescription && taskGroup.description && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                            {taskGroup.description}
                                        </div>
                                    )}

                                    {showTaskCount && taskGroup.tasks && taskGroup.tasks.length > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {taskGroup.tasks.length} {taskGroup.tasks.length === 1 ? "task" : "tasks"}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskListVirtualized;
