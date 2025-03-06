import React, { useState } from "react";
import {
    GanttChart,
    TaskGroup,
    Task,
    GanttTitle,
    GanttHeader,
    GanttCurrentDateMarker,
    GanttTaskList,
    GanttTimeline,
} from "react-modern-gantt";

// Constant for initial task data
const INITIAL_TASKS: TaskGroup[] = [
    {
        id: "eng-team",
        name: "Engineering",
        description: "Development Team",
        tasks: [
            {
                id: "task-1",
                name: "UI Components",
                startDate: new Date(2025, 0, 1),
                endDate: new Date(2025, 1, 15),
                color: "bg-blue-500",
                percent: 80,
            },
            {
                id: "task-2",
                name: "Backend API",
                startDate: new Date(2025, 1, 1),
                endDate: new Date(2025, 2, 30),
                color: "bg-emerald-500",
                percent: 60,
            },
            {
                id: "task-3",
                name: "Database Schema",
                startDate: new Date(2025, 2, 15),
                endDate: new Date(2025, 3, 30),
                color: "bg-cyan-600",
                percent: 35,
            },
        ],
    },
    {
        id: "marketing",
        name: "Marketing",
        description: "Marketing Team",
        tasks: [
            {
                id: "task-4",
                name: "Campaign Planning",
                startDate: new Date(2025, 0, 15),
                endDate: new Date(2025, 1, 28),
                color: "bg-purple-500",
                percent: 100,
            },
            {
                id: "task-5",
                name: "Content Creation",
                startDate: new Date(2025, 2, 1),
                endDate: new Date(2025, 3, 15),
                color: "bg-violet-600",
                percent: 50,
            },
        ],
    },
    {
        id: "design",
        name: "Design",
        description: "UI/UX Team",
        tasks: [
            {
                id: "task-6",
                name: "Wireframing",
                startDate: new Date(2025, 0, 5),
                endDate: new Date(2025, 1, 10),
                color: "bg-amber-500",
                percent: 100,
            },
            {
                id: "task-7",
                name: "Visual Design",
                startDate: new Date(2025, 1, 15),
                endDate: new Date(2025, 3, 1),
                color: "bg-orange-500",
                percent: 70,
            },
        ],
    },
];

// Array with all months for the month switcher
const MONTHS = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
];

// Custom themes
const customLightTheme = {
    headerBackground: "bg-indigo-50",
    headerText: "text-indigo-800",
    backgroundHighlight: "bg-blue-100",
    borderColor: "border-indigo-100",
    todayMarkerColor: "bg-pink-500",
};

const customDarkTheme = {
    headerBackground: "bg-gray-800",
    headerText: "text-indigo-300",
    backgroundHighlight: "bg-gray-700",
    borderColor: "border-gray-600",
    todayMarkerColor: "bg-pink-500",
    chartBackground: "bg-gray-900",
    taskBackground: "bg-indigo-600",
    taskText: "text-white",
    tooltipBackground: "bg-gray-800",
    tooltipText: "text-gray-200",
};

// Component for controls above each Gantt chart
const Controls: React.FC<{
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
    darkMode: boolean;
    setDarkMode: (mode: boolean) => void;
    currentMonth: number;
    setCurrentMonth: (month: number) => void;
    className?: string;
}> = ({ editMode, setEditMode, darkMode, setDarkMode, currentMonth, setCurrentMonth, className = "" }) => (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
        <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Edit Mode:</span>
            <button
                onClick={() => setEditMode(!editMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                    editMode ? "bg-indigo-600" : "bg-gray-200"
                }`}>
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editMode ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
        </div>

        <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Dark Mode:</span>
            <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                    darkMode ? "bg-indigo-600" : "bg-gray-200"
                }`}>
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
        </div>

        <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Current Month:
            </span>
            <select
                value={currentMonth}
                onChange={e => setCurrentMonth(parseInt(e.target.value))}
                className={`rounded border ${
                    darkMode ? "border-gray-600 bg-gray-800 text-gray-200" : "border-gray-300 bg-white text-gray-700"
                } px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}>
                {MONTHS.map(month => (
                    <option key={month.value} value={month.value}>
                        {month.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

const GanttChartDemo = () => {
    // Current date for initializing the month switcher
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();

    // Separate states for both Gantt charts
    const [basicTasks, setBasicTasks] = useState<TaskGroup[]>(INITIAL_TASKS);
    const [customTasks, setCustomTasks] = useState<TaskGroup[]>(INITIAL_TASKS);

    // States for controls
    const [basicEditMode, setBasicEditMode] = useState(true);
    const [customEditMode, setCustomEditMode] = useState(true);
    const [basicCurrentMonth, setBasicCurrentMonth] = useState(currentMonthIndex);
    const [customCurrentMonth, setCustomCurrentMonth] = useState(currentMonthIndex);

    // Dark mode states
    const [basicDarkMode, setBasicDarkMode] = useState(false);
    const [customDarkMode, setCustomDarkMode] = useState(true); // Start with dark mode for custom chart

    // Task update function for Basic Gantt
    const handleBasicTaskUpdate = (groupId: string, updatedTask: Task) => {
        setBasicTasks(prevTasks =>
            prevTasks.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.map((task: Task) => (task.id === updatedTask.id ? updatedTask : task)),
                      }
                    : group
            )
        );
    };

    // Task update function for Custom Gantt
    const handleCustomTaskUpdate = (groupId: string, updatedTask: Task) => {
        setCustomTasks(prevTasks =>
            prevTasks.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.map((task: Task) => (task.id === updatedTask.id ? updatedTask : task)),
                      }
                    : group
            )
        );
    };

    return (
        <div className={`min-h-screen p-8 ${basicDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            {/* Header */}
            <header className="mx-auto mb-12 max-w-6xl text-center">
                <h1 className={`mb-3 text-4xl font-bold ${basicDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                    React Modern Gantt
                </h1>
                <p className={`text-lg ${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    A modern, customizable Gantt chart component for React applications
                </p>
            </header>

            <div className="mx-auto max-w-6xl space-y-16">
                {/* Basic Gantt Chart */}
                <section className={`rounded-xl ${basicDarkMode ? "bg-gray-800" : "bg-white"} p-6 shadow-lg`}>
                    <h2 className={`mb-6 text-2xl font-bold ${basicDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                        Basic Gantt Chart
                    </h2>
                    <p className={`mb-6 ${basicDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Simple implementation with standard props. Drag, resize, progress display, and dark mode
                        support.
                    </p>

                    <Controls
                        editMode={basicEditMode}
                        setEditMode={setBasicEditMode}
                        darkMode={basicDarkMode}
                        setDarkMode={setBasicDarkMode}
                        currentMonth={basicCurrentMonth}
                        setCurrentMonth={setBasicCurrentMonth}
                        className="mb-6"
                    />

                    <div
                        className={`rounded-lg border ${basicDarkMode ? "border-gray-700" : "border-gray-200"} shadow`}>
                        <GanttChart
                            tasks={basicTasks}
                            title="Project Roadmap 2025"
                            headerLabel="Teams"
                            showProgress={true}
                            editMode={basicEditMode}
                            currentDate={new Date(2025, basicCurrentMonth, 15)} // Sets the current month
                            showCurrentDateMarker={true}
                            onTaskUpdate={handleBasicTaskUpdate}
                            onTaskSelect={(task: Task, isSelected: boolean) =>
                                console.log(`Task ${task.name} ${isSelected ? "selected" : "deselected"}`)
                            }
                        />
                    </div>
                </section>

                {/* Custom Gantt Chart */}
                <section className={`rounded-xl ${customDarkMode ? "bg-gray-800" : "bg-white"} p-6 shadow-lg`}>
                    <h2 className={`mb-6 text-2xl font-bold ${customDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                        Customized Gantt Chart
                    </h2>
                    <p className={`mb-6 ${customDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Advanced implementation with composition components and custom theme.
                    </p>

                    <Controls
                        editMode={customEditMode}
                        setEditMode={setCustomEditMode}
                        darkMode={customDarkMode}
                        setDarkMode={setCustomDarkMode}
                        currentMonth={customCurrentMonth}
                        setCurrentMonth={setCustomCurrentMonth}
                        className="mb-6"
                    />

                    <div
                        className={`rounded-lg border ${
                            customDarkMode ? "border-gray-700" : "border-gray-200"
                        } shadow`}>
                        <GanttChart
                            tasks={customTasks}
                            onTaskUpdate={handleCustomTaskUpdate}
                            onTaskDoubleClick={(task: Task) => alert(`Double-clicked: ${task.name}`)}
                            editMode={customEditMode}
                            darkMode={customDarkMode}
                            theme={customDarkMode ? customDarkTheme : customLightTheme} // Use theme based on dark mode
                            currentDate={new Date(2025, customCurrentMonth, 15)}
                            showCurrentDateMarker={true}
                            fontSize="14px"
                            rowHeight={45}>
                            <GanttTitle
                                className={`text-2xl font-bold ${
                                    customDarkMode ? "text-indigo-300" : "text-indigo-800"
                                }`}>
                                Product Development 2025
                            </GanttTitle>

                            <GanttHeader
                                className={`${customDarkMode ? "text-indigo-300" : "text-indigo-600"} font-medium`}>
                                Team Overview
                            </GanttHeader>

                            <GanttCurrentDateMarker className="bg-pink-500">Today</GanttCurrentDateMarker>

                            <GanttTaskList
                                showIcon={true}
                                className={`w-48 ${
                                    customDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-indigo-100"
                                } border-r`}
                            />

                            <GanttTimeline
                                className={`text-sm ${
                                    customDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-indigo-100"
                                } border-b`}
                            />
                        </GanttChart>
                    </div>
                </section>

                {/* Footer */}
                <footer
                    className={`mt-12 border-t ${
                        basicDarkMode ? "border-gray-700" : "border-gray-200"
                    } pt-6 text-center text-sm ${basicDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <p>© 2025 React Modern Gantt - MIT License</p>
                </footer>
            </div>
        </div>
    );
};

export default GanttChartDemo;
