import React, { useState } from "react";
import { Task, TaskGroup, ViewMode } from "react-modern-gantt";
import { useTheme } from "../../context/ThemeContext";
import GanttChart from "react-modern-gantt";
// Important: Dont forget to import the css file
import "react-modern-gantt/dist/index.css";

const GanttDemo: React.FC = () => {
    const { darkMode } = useTheme();

    // Generate initial task data relative to current date for easier demo
    const generateInitialTasks = (): TaskGroup[] => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        return [
            {
                id: "engineering",
                name: "Engineering",
                description: "Development Team",
                tasks: [
                    {
                        id: "task-1",
                        name: "UI Components",
                        startDate: new Date(currentYear, currentMonth - 1, 5),
                        endDate: new Date(currentYear, currentMonth + 1, 15),
                        color: "#3B82F6", // blue-500
                        percent: 80,
                    },
                    {
                        id: "task-2",
                        name: "Backend API",
                        startDate: new Date(currentYear, currentMonth, 10),
                        endDate: new Date(currentYear, currentMonth + 2, 20),
                        color: "#10B981", // emerald-500
                        percent: 60,
                    },
                    {
                        id: "task-3",
                        name: "Database Schema",
                        startDate: new Date(currentYear, currentMonth + 1, 15),
                        endDate: new Date(currentYear, currentMonth + 2, 30),
                        color: "#8B5CF6", // purple-500
                        percent: 35,
                        dependencies: ["task-2"],
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
                        startDate: new Date(currentYear, currentMonth - 1, 15),
                        endDate: new Date(currentYear, currentMonth, 28),
                        color: "#8B5CF6", // purple-500
                        percent: 100,
                    },
                    {
                        id: "task-5",
                        name: "Content Creation",
                        startDate: new Date(currentYear, currentMonth + 1, 1),
                        endDate: new Date(currentYear, currentMonth + 2, 15),
                        color: "#7C3AED", // violet-600
                        percent: 50,
                        dependencies: ["task-4"],
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
                        startDate: new Date(currentYear, currentMonth - 1, 10),
                        endDate: new Date(currentYear, currentMonth, 20),
                        color: "#F59E0B", // amber-500
                        percent: 100,
                    },
                    {
                        id: "task-7",
                        name: "Visual Design",
                        startDate: new Date(currentYear, currentMonth, 25),
                        endDate: new Date(currentYear, currentMonth + 2, 5),
                        color: "#F59E0B", // amber-500
                        percent: 70,
                        dependencies: ["task-6"],
                    },
                ],
            },
        ];
    };

    // State for tasks and control options
    const [tasks, setTasks] = useState<TaskGroup[]>(generateInitialTasks());
    const [editMode, setEditMode] = useState(true);
    const [showProgress, setShowProgress] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MONTH);

    // Task update handler
    const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
        setTasks(prevTasks =>
            prevTasks.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.map((task: Task) => (task.id === updatedTask.id ? updatedTask : task)),
                      }
                    : group,
            ),
        );
    };

    // View mode change handler
    const handleViewModeChange = (newMode: ViewMode) => {
        setViewMode(newMode);
    };

    // Custom styles for the Gantt chart
    const ganttStyles = {
        container: "",
        title: "text-xl font-bold",
        taskList: `border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`,
        timeline: "",
        tooltip: `${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`,
    };

    return (
        <div className="mb-8">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <span className={`mr-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Edit Mode
                            </span>
                            <div
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    editMode ? "bg-indigo-600" : "bg-gray-300"
                                }`}>
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                        editMode ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={editMode}
                                    onChange={() => setEditMode(!editMode)}
                                />
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <span className={`mr-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Progress
                            </span>
                            <div
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    showProgress ? "bg-indigo-600" : "bg-gray-300"
                                }`}>
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                        showProgress ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={showProgress}
                                    onChange={() => setShowProgress(!showProgress)}
                                />
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Improved container with better styling */}
            <div
                className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}
                ${darkMode ? "border border-gray-700" : "border border-gray-200"}
                shadow-lg transition-all duration-300`}>
                <div className="overflow-hidden">
                    <GanttChart
                        tasks={tasks}
                        title="Project Roadmap"
                        headerLabel="Teams"
                        showProgress={showProgress}
                        editMode={editMode}
                        darkMode={darkMode}
                        onTaskUpdate={handleTaskUpdate}
                        onViewModeChange={handleViewModeChange}
                        viewMode={viewMode}
                        viewModes={[
                            ViewMode.MINUTE,
                            ViewMode.HOUR,
                            ViewMode.DAY,
                            ViewMode.WEEK,
                            ViewMode.MONTH,
                            ViewMode.QUARTER,
                        ]}
                        styles={ganttStyles}
                    />
                </div>

                <div
                    className={`mt-4 p-4 text-center border-t border-dashed transition-colors ${
                        darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50/80"
                    }`}>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Try dragging tasks, resizing them, or adjusting progress bars to see the component in action.
                    </p>
                </div>

                {/* CSS-Import Hinweis - neu gestaltet */}
                <div
                    className={`flex items-center justify-center py-3 border-t transition-colors ${
                        darkMode ? "border-blue-800 bg-blue-900/30" : "border-blue-200 bg-blue-50"
                    }`}>
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                                darkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800"
                            }`}>
                            CSS
                        </span>
                        <code className={`text-sm font-mono ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                            import "react-modern-gantt/dist/index.css"
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttDemo;
