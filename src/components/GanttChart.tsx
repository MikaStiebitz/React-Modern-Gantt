import React, { useRef, useState, useEffect } from "react";
import { Person, Task, GanttChartProps, DEFAULT_THEME, generateTimelineHeader, getDuration } from "../models";
import NameList from "./NameList";
import Timeline from "./Timeline";
import TaskRow from "./TaskRow";

/**
 * GanttChart Component
 *
 * A modern, interactive Gantt chart for project planning and visualization
 */
export const GanttChart: React.FC<GanttChartProps> = ({
    people,
    startDate: customStartDate,
    endDate: customEndDate,
    title = "Project Timeline",
    showAvatar = true,
    showTaskCount = true,
    theme = DEFAULT_THEME,
    onTaskUpdate,
    onTaskClick,
    onProgressChange,
    currentDate = new Date(),
    showCurrentDateMarker = true,
    visibleColumns = 6,
    columnWidth = 200,
}) => {
    // Find the earliest and latest dates if not provided
    const derivedStartDate = customStartDate || findEarliestDate(people);
    const derivedEndDate = customEndDate || findLatestDate(people);

    // Add padding to the timeline start/end
    const startDate = new Date(derivedStartDate);
    startDate.setDate(1); // Set to the first day of the month

    const endDate = new Date(derivedEndDate);
    endDate.setMonth(endDate.getMonth() + 1, 0); // Set to the last day of the month

    const totalDays = getDuration(startDate, endDate);
    const dates = generateTimelineHeader(startDate, endDate);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Calculate current date marker position
    const currentDatePosition = getCurrentDatePosition(currentDate, startDate, totalDays);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setScrollLeft(scrollContainerRef.current.scrollLeft);
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    const handleTaskUpdate = (personId: string, updatedTask: Task) => {
        if (onTaskUpdate) {
            onTaskUpdate(personId, updatedTask);
        }
    };

    const handleTaskClick = (task: Task, person: Person) => {
        if (onTaskClick) {
            onTaskClick(task, person);
        }
    };

    const handleProgressChange = (personId: string, taskId: string, percent: number) => {
        if (onProgressChange) {
            onProgressChange(personId, taskId, percent);
        } else if (onTaskUpdate) {
            // If no specific progress handler, update the whole task
            const person = people.find(p => p.id === personId);
            if (person) {
                const task = person.tasks.find(t => t.id === taskId);
                if (task) {
                    const updatedTask = { ...task, percent };
                    onTaskUpdate(personId, updatedTask);
                }
            }
        }
    };

    return (
        <div className="gantt-chart w-full rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold">{title}</h2>
            </div>

            <div className="flex">
                <NameList people={people} showAvatar={showAvatar} showTaskCount={showTaskCount} theme={theme} />

                <div className="flex-grow relative">
                    <Timeline
                        startDate={startDate}
                        endDate={endDate}
                        columnWidth={columnWidth}
                        theme={theme}
                        scrollContainerRef={scrollContainerRef}>
                        {people.map((person: Person) => (
                            <TaskRow
                                key={person.id}
                                person={person}
                                startDate={startDate}
                                endDate={endDate}
                                columnWidth={columnWidth}
                                theme={theme}
                                onTaskUpdate={handleTaskUpdate}
                                onTaskClick={handleTaskClick}
                                onProgressChange={handleProgressChange}
                            />
                        ))}
                    </Timeline>

                    {showCurrentDateMarker && (
                        <div
                            className={`absolute top-0 bottom-0 w-px ${theme.todayMarkerColor || "bg-red-500"} z-20`}
                            style={{
                                left: `${currentDatePosition}%`,
                                transform: `translateX(-${scrollLeft}px)`,
                            }}>
                            <div
                                className={`absolute -top-1 left-1/2 transform -translate-x-1/2 ${
                                    theme.todayMarkerColor || "bg-red-500"
                                } px-2 py-1 rounded text-xs text-white whitespace-nowrap`}>
                                Today
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper functions
function findEarliestDate(people: Person[]): Date {
    let earliestDate = new Date();

    people.forEach((person: Person) => {
        person.tasks.forEach((task: Task) => {
            if (task.startDate < earliestDate) {
                earliestDate = new Date(task.startDate);
            }
        });
    });

    return earliestDate;
}

function findLatestDate(people: Person[]): Date {
    let latestDate = new Date();

    people.forEach((person: Person) => {
        person.tasks.forEach((task: Task) => {
            if (task.endDate > latestDate) {
                latestDate = new Date(task.endDate);
            }
        });
    });

    return latestDate;
}

function getCurrentDatePosition(currentDate: Date, startDate: Date, totalDays: number): number {
    const currentDayOffset = getDuration(startDate, currentDate);
    return (currentDayOffset / totalDays) * 100;
}

export default GanttChart;
