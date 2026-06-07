import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import CodeExample from "../components/demo/CodeExample";
import GanttCodeExample from "../components/demo/GanttCodeExample";
import GranularControlsDemo from "../components/demo/GranularControlsDemo";
import { Link } from "react-router-dom";

const ComponentsPage: React.FC = () => {
    const { darkMode } = useTheme();
    const [activeSection, setActiveSection] = useState("gantt-chart");
    // Add refs for tracking sections
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // Sections array (add the new custom-rendering section)
    const sections = [
        { id: "gantt-chart", label: "GanttChart" },
        { id: "styling", label: "CSS Styling" },
        { id: "task-interfaces", label: "Task Interfaces" },
        { id: "props", label: "Props" },
        { id: "events", label: "Event Handlers" },
        { id: "view-modes", label: "View Modes" },
        { id: "customization", label: "Customization" },
        { id: "custom-rendering", label: "Custom Rendering" },
        { id: "granular-controls", label: "Granular Controls Demo" }, // New interactive demo
        { id: "export", label: "Export (Image/PDF)" }, // New export feature
        { id: "examples", label: "Code Examples" },
        { id: "troubleshooting", label: "Troubleshooting" },
    ];

    // Initialize section refs
    useEffect(() => {
        sectionRefs.current = sections.reduce(
            (acc, section) => {
                acc[section.id] = document.getElementById(section.id);
                return acc;
            },
            {} as Record<string, HTMLElement | null>,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle URL hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                setActiveSection(hash);
                // Scroll to the section
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }
        };

        // Check on mount
        handleHashChange();

        // Setup event listener
        window.addEventListener("hashchange", handleHashChange);
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    // Add scroll spy functionality
    useEffect(() => {
        const handleScroll = () => {
            // Get current scroll position
            const scrollPosition = window.scrollY + 100; // Adding offset to improve detection

            // Find the section that is currently visible
            const currentSection = sections.find(section => {
                const element = sectionRefs.current[section.id];
                if (!element) return false;

                const offsetTop = element.offsetTop;
                const offsetHeight = element.offsetHeight;

                return scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight;
            });

            // Update active section if a section is found
            if (currentSection && currentSection.id !== activeSection) {
                setActiveSection(currentSection.id);

                // Update URL hash without scrolling
                const newUrl = `${window.location.pathname}#${currentSection.id}`;
                window.history.replaceState(null, "", newUrl);
            }
        };

        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);
        // Run once to set initial state
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSection]);

    // Code examples
    const codeExamples = {
        // Updated import example with CSS
        ganttChartImport: `// Import components
import { GanttChart, ViewMode } from 'react-modern-gantt';
// ⚠️ IMPORTANT: Don't forget to import the CSS
import 'react-modern-gantt/dist/index.css';`,

        // CSS styling section - NEW
        cssImport: `// Option 1: Import in your JS/TS file (Recommended)
import 'react-modern-gantt/dist/index.css';

// Option 2: Reference in your HTML
<link rel="stylesheet" href="https://unpkg.com/react-modern-gantt@0.5.0/dist/index.css" />`,

        troubleshooting: `// If your Gantt chart appears without styling, make sure you've imported the CSS
import 'react-modern-gantt/dist/index.css';

// This should be imported in:
// - Your main application file (e.g., App.js, index.js)
// - OR the component file where you use GanttChart
// - OR a global CSS file that is imported in your application`,

        taskInterfaces: `// Task interface
interface Task {
  id: string;         // Unique identifier
  name: string;       // Task name
  startDate: Date;    // Start date
  endDate: Date;      // End date
  color?: string;     // Task color (CSS color value like "#3B82F6")
  percent?: number;   // Completion percentage (0-100)
  dependencies?: string[]; // IDs of dependent tasks
  [key: string]: any; // Additional custom properties
}

// TaskGroup interface
interface TaskGroup {
  id: string;         // Unique identifier
  name: string;       // Group name
  description?: string; // Group description
  icon?: string;      // Optional icon (HTML string)
  tasks: Task[];      // Array of tasks in this group
  [key: string]: any; // Additional custom properties
}`,

        coreProps: `<GanttChart
  tasks={tasks}                  // TaskGroup[] - Array of task groups
  title="Project Timeline"       // Title displayed at the top of the chart
  viewMode="month"               // "day", "week", "month", "quarter", "year"
  startDate={new Date()}         // Optional start date for the timeline
  endDate={new Date()}           // Optional end date for the timeline
  currentDate={new Date()}       // Date for the today marker
  showCurrentDateMarker={true}   // Whether to show the today marker
  todayLabel="Today"             // Label for today marker
  editMode={true}                // Whether tasks can be dragged/resized
  headerLabel="Resources"        // Header label for the task list column
  showProgress={true}            // Whether to show progress indicators
  darkMode={false}               // Whether to use dark mode
  showViewModeSelector={true}    // Whether to show the view mode selector
/>`,

        eventHandlers: `<GanttChart
  tasks={tasks}
  // Called when a task is moved, resized, or progress updated
  onTaskUpdate={(groupId, updatedTask) => {
    console.log("Task updated:", updatedTask);
    // Update your state here
  }}

  // Called when a task is clicked
  onTaskClick={(task, group) => {
    console.log("Task clicked:", task);
  }}

  // Called when a task is selected
  onTaskSelect={(task, isSelected) => {
    console.log("Task selection changed:", task, isSelected);
  }}

  // Called when a task is double-clicked
  onTaskDoubleClick={(task) => {
    console.log("Task double-clicked:", task);
  }}

  // Called when a group is clicked
  onGroupClick={(group) => {
    console.log("Group clicked:", group);
  }}

  // Called when view mode changes
  onViewModeChange={(viewMode) => {
    console.log("View mode changed to:", viewMode);
  }}
/>`,

        viewModes: `
// Set default view mode
import { GanttChart, ViewMode } from 'react-modern-gantt';

<GanttChart tasks={tasks} viewMode={ViewMode.MINUTE} />
<GanttChart tasks={tasks} viewMode={ViewMode.HOUR} />
<GanttChart tasks={tasks} viewMode={ViewMode.DAY} />
<GanttChart tasks={tasks} viewMode={ViewMode.WEEK} />
<GanttChart tasks={tasks} viewMode={ViewMode.MONTH} />
<GanttChart tasks={tasks} viewMode={ViewMode.QUARTER} />
<GanttChart tasks={tasks} viewMode={ViewMode.YEAR} />

// Custom view mode selector
<GanttChart tasks={tasks} viewModes={[ViewMode.MINUTE, ViewMode.HOUR]} />
<GanttChart tasks={tasks} viewModes={[ViewMode.DAY, ViewMode.WEEK, ViewMode.MONTH]} />
<GanttChart tasks={tasks} viewModes={[ViewMode.YEAR, ViewMode.QUARTER]} />
<GanttChart tasks={tasks} viewModes={false} /> // Hide view mode selector`,

        customStyling: `<GanttChart
  tasks={tasks}
  styles={{
    container: "border-2 border-blue-200 rounded-xl",
    title: "text-2xl text-blue-800 font-bold",
    taskList: "bg-blue-50 border-r border-blue-100",
    timeline: "bg-gray-50",
    todayMarker: "bg-red-500",
    taskRow: "hover:bg-slate-50",
    tooltip: "shadow-lg"
  }}
  onTaskUpdate={handleTaskUpdate}
/>`,

        customTaskRender: `<GanttChart
  tasks={tasks}
  renderTask={({ task, leftPx, widthPx, topPx, isHovered, isDragging, showProgress }) => (
    <div
      className="absolute flex items-center px-2 rounded"
      style={{
        left: \`\${leftPx}px\`,
        width: \`\${widthPx}px\`,
        top: \`\${topPx}px\`,
        height: '32px',
        backgroundColor: task.color || "#3B82F6",
        boxShadow: isHovered ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      }}>
      <div className="text-white truncate">{task.name}</div>
      {showProgress && (
        <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/20 rounded-full">
          <div
            className="h-full bg-white/80 rounded-full"
            style={{ width: \`\${task.percent || 0}%\` }}
          />
        </div>
      )}
    </div>
  )}
/>`,

        completeExample: `import React, { useState } from 'react';
import { GanttChart, Task, TaskGroup, ViewMode } from 'react-modern-gantt';
// ⚠️ IMPORTANT: Don't forget to import the CSS
import 'react-modern-gantt/dist/index.css';

const ProjectTimeline = () => {
  // Initialize tasks
  const [tasks, setTasks] = useState<TaskGroup[]>([
    {
      id: "engineering",
      name: "Engineering",
      description: "Development Team",
      tasks: [
        {
          id: "task-1",
          name: "UI Components",
          startDate: new Date(2023, 0, 5),
          endDate: new Date(2023, 2, 15),
          color: "#3B82F6", // blue-500
          percent: 80,
        },
        {
          id: "task-2",
          name: "Backend API",
          startDate: new Date(2023, 1, 10),
          endDate: new Date(2023, 3, 20),
          color: "#10B981", // emerald-500
          percent: 60,
        },
        // More tasks...
      ],
    },
    // More groups...
  ]);

  // State for view mode
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MONTH);

  // Handle task updates
  const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
    // Update task in state
    setTasks(prevTasks =>
      prevTasks.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
              ),
            }
          : group
      )
    );
  };

  // Handle view mode changes
  const handleViewModeChange = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
  };

  // Custom styles
  const ganttStyles = {
    container: "border rounded-lg",
    title: "text-2xl font-bold text-indigo-800",
    taskList: "bg-gray-50 border-r",
  };

  return (
    <GanttChart
      tasks={tasks}
      title="Project Timeline"
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      onTaskUpdate={handleTaskUpdate}
      showProgress={true}
      editMode={true}
      styles={ganttStyles}
    />
  );
};

export default ProjectTimeline;`,
    };

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        // Update URL without reloading the page
        window.history.pushState(null, "", `#${id}`);
    };

    // Animations for sections
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    // Props table data
    const propsTableData = [
        {
            prop: "tasks",
            type: "TaskGroup[]",
            defaultValue: "[]",
            description: "Array of task groups containing tasks",
            isRequired: true,
        },
        {
            prop: "title",
            type: "string",
            defaultValue: '"Project Timeline"',
            description: "Title displayed at the top of the chart",
            isRequired: false,
        },
        {
            prop: "viewMode",
            type: "ViewMode | string",
            defaultValue: "ViewMode.MONTH",
            description: "Timeline display mode (day, week, month, quarter, year)",
            isRequired: false,
        },
        {
            prop: "startDate",
            type: "Date",
            defaultValue: "Auto calculated",
            description: "Optional start date for the timeline (defaults to earliest task date)",
            isRequired: false,
        },
        {
            prop: "endDate",
            type: "Date",
            defaultValue: "Auto calculated",
            description: "Optional end date for the timeline (defaults to latest task date)",
            isRequired: false,
        },
        {
            prop: "currentDate",
            type: "Date",
            defaultValue: "new Date()",
            description: "Date for the today marker",
            isRequired: false,
        },
        {
            prop: "showCurrentDateMarker",
            type: "boolean",
            defaultValue: "true",
            description: "Whether to show the today marker",
            isRequired: false,
        },
        {
            prop: "todayLabel",
            type: "string",
            defaultValue: '"Today"',
            description: "Label for today marker",
            isRequired: false,
        },
        {
            prop: "editMode",
            type: "boolean",
            defaultValue: "true",
            description: "Whether tasks can be dragged/resized",
            isRequired: false,
        },
        {
            prop: "headerLabel",
            type: "string",
            defaultValue: '"Resources"',
            description: "Header label for the task list column",
            isRequired: false,
        },
        {
            prop: "showProgress",
            type: "boolean",
            defaultValue: "false",
            description: "Whether to show progress indicators",
            isRequired: false,
        },
        {
            prop: "darkMode",
            type: "boolean",
            defaultValue: "false",
            description: "Whether to use dark mode theme",
            isRequired: false,
        },
        {
            prop: "viewModes",
            type: "ViewMode[] | false",
            defaultValue: "All modes",
            description: "Array of allowed view modes or false to hide selector",
            isRequired: false,
        },
        {
            prop: "smoothDragging",
            type: "boolean",
            defaultValue: "true",
            description: "Whether to use smooth animation for dragging",
            isRequired: false,
        },
        {
            prop: "animationSpeed",
            type: "number",
            defaultValue: "0.25",
            description: "Speed of animations (0.1 to 1)",
            isRequired: false,
        },
        {
            prop: "styles",
            type: "GanttStyles",
            defaultValue: "{}",
            description: "Custom CSS class names for styling",
            isRequired: false,
        },
        {
            prop: "locale",
            type: "string",
            defaultValue: '"default"',
            description: "Locale for date formatting",
            isRequired: false,
        },
        {
            prop: "renderTask",
            type: "function",
            defaultValue: "undefined",
            description: "Custom render function for task items",
            isRequired: false,
        },
        {
            prop: "renderTooltip",
            type: "function",
            defaultValue: "undefined",
            description: "Custom render function for tooltips",
            isRequired: false,
        },
        {
            prop: "renderTaskList",
            type: "function",
            defaultValue: "undefined",
            description: "Custom render function for the task list",
            isRequired: false,
        },
        {
            prop: "renderHeader",
            type: "function",
            defaultValue: "undefined",
            description: "Custom render function for the header",
            isRequired: false,
        },
        {
            prop: "getTaskColor",
            type: "function",
            defaultValue: "undefined",
            description: "Function to determine task colors",
            isRequired: false,
        },
        {
            prop: "focusMode",
            type: "boolean",
            defaultValue: "true",
            description: "When enabled, automatically focuses on today marker when switching view modes",
            isRequired: false,
        },
    ];

    // Events table data
    const eventsTableData = [
        {
            event: "onTaskUpdate",
            type: "(groupId: string, updatedTask: Task) => void",
            description: "Called when a task is moved, resized, or progress updated",
        },
        {
            event: "onTaskClick",
            type: "(task: Task, group: TaskGroup) => void",
            description: "Called when a task is clicked",
        },
        {
            event: "onTaskSelect",
            type: "(task: Task, isSelected: boolean) => void",
            description: "Called when a task is selected or deselected",
        },
        {
            event: "onTaskDoubleClick",
            type: "(task: Task) => void",
            description: "Called when a task is double-clicked",
        },
        {
            event: "onGroupClick",
            type: "(group: TaskGroup) => void",
            description: "Called when a task group is clicked",
        },
        {
            event: "onViewModeChange",
            type: "(viewMode: ViewMode) => void",
            description: "Called when the view mode changes",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Sidebar navigation */}
                <div className="hidden lg:block lg:col-span-3">
                    <nav className={`sticky top-24 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <h2 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Documentation
                        </h2>
                        <ul className="space-y-3">
                            {sections.map(section => (
                                <li key={section.id}>
                                    <button
                                        onClick={() => scrollToSection(section.id)}
                                        className={`block text-left w-full px-3 py-2 rounded-md transition-colors duration-200 ${
                                            activeSection === section.id
                                                ? `${darkMode ? "bg-gray-800 text-indigo-400" : "bg-indigo-50 text-indigo-700"}`
                                                : `${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`
                                        }`}>
                                        {section.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                to="/"
                                className={`flex items-center text-sm ${
                                    darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                                }`}>
                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </nav>
                </div>

                {/* Main content */}
                <div className="lg:col-span-9">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Component Documentation
                    </motion.h1>

                    {/* GanttChart Section */}
                    <motion.section
                        id="gantt-chart"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            GanttChart Component
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The main component for rendering a Gantt chart. It supports various props to customize its
                            appearance and behavior.
                        </p>

                        <CodeExample
                            title="Importing the Component"
                            description="Start by importing the GanttChart component, styles, and any related types you need."
                            code={codeExamples.ganttChartImport}
                            language="javascript"
                        />

                        <div
                            className={`mt-6 p-4 border-l-4 mb-8 ${
                                darkMode
                                    ? "bg-gray-800 border-amber-500 text-amber-200"
                                    : "bg-amber-50 border-amber-500 text-amber-700"
                            }`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm">
                                        <strong>IMPORTANT:</strong> Don't forget to import the CSS file! Without this
                                        import, the component will not be styled correctly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* CSS Styling Section - NEW */}
                    <motion.section
                        id="styling"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            CSS Styling
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The Gantt chart requires CSS styles that are shipped separately from the component code. You
                            need to explicitly import these styles for the component to render correctly.
                        </p>

                        <CodeExample
                            title="Importing Styles"
                            description="There are two ways to include the necessary CSS styles."
                            code={codeExamples.cssImport}
                            language="javascript"
                        />

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} border ${
                                    darkMode ? "border-gray-700" : "border-gray-200"
                                }`}>
                                <h3
                                    className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    ✅ With CSS Import
                                </h3>
                                <div className="h-32 border rounded overflow-hidden flex items-center justify-center bg-white">
                                    <img
                                        src="https://placeholder.pics/svg/300x100/DEDEDE/555555/With%20CSS%20Styling"
                                        alt="With CSS Import - Styled Gantt Chart"
                                        className="max-w-full max-h-full"
                                    />
                                </div>
                                <p className={`mt-3 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    Properly styled with borders, colors, and interactive elements.
                                </p>
                            </div>

                            <div
                                className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} border ${
                                    darkMode ? "border-gray-700" : "border-gray-200"
                                }`}>
                                <h3
                                    className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    ❌ Without CSS Import
                                </h3>
                                <div className="h-32 border rounded overflow-hidden flex items-center justify-center bg-white">
                                    <img
                                        src="https://placeholder.pics/svg/300x100/FFFFFF/999999/Unstyled%20Components"
                                        alt="Without CSS Import - Unstyled Gantt Chart"
                                        className="max-w-full max-h-full"
                                    />
                                </div>
                                <p className={`mt-3 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    Missing styles, layout issues, and reduced functionality.
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Task Interfaces Section */}
                    <motion.section
                        id="task-interfaces"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Task Interfaces
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component uses two main interfaces for structuring your task data:{" "}
                            <code>Task</code> and <code>TaskGroup</code>.
                        </p>

                        <CodeExample
                            title="Task and TaskGroup Interfaces"
                            description="These interfaces define the structure of your task data."
                            code={codeExamples.taskInterfaces}
                            language="typescript"
                        />
                    </motion.section>

                    {/* Props Section */}
                    <motion.section
                        id="props"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Props Reference
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component accepts the following props to customize its behavior and
                            appearance.
                        </p>

                        {/* New detailed Props Table */}
                        <div
                            className={`overflow-x-auto rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"} mb-8`}>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                                    <tr>
                                        <th
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium ${
                                                darkMode
                                                    ? "text-gray-300 uppercase tracking-wider"
                                                    : "text-gray-500 uppercase tracking-wider"
                                            }`}>
                                            Prop
                                        </th>
                                        <th
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium ${
                                                darkMode
                                                    ? "text-gray-300 uppercase tracking-wider"
                                                    : "text-gray-500 uppercase tracking-wider"
                                            }`}>
                                            Type
                                        </th>
                                        <th
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium ${
                                                darkMode
                                                    ? "text-gray-300 uppercase tracking-wider"
                                                    : "text-gray-500 uppercase tracking-wider"
                                            }`}>
                                            Default
                                        </th>
                                        <th
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium ${
                                                darkMode
                                                    ? "text-gray-300 uppercase tracking-wider"
                                                    : "text-gray-500 uppercase tracking-wider"
                                            }`}>
                                            Description
                                        </th>
                                        <th
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium ${
                                                darkMode
                                                    ? "text-gray-300 uppercase tracking-wider"
                                                    : "text-gray-500 uppercase tracking-wider"
                                            }`}>
                                            Required
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    className={`divide-y ${darkMode ? "divide-gray-700 bg-gray-900" : "divide-gray-200 bg-white"}`}>
                                    {propsTableData.map((prop, index) => (
                                        <tr
                                            key={prop.prop}
                                            className={
                                                index % 2 === 0
                                                    ? darkMode
                                                        ? "bg-gray-900"
                                                        : "bg-white"
                                                    : darkMode
                                                      ? "bg-gray-800/50"
                                                      : "bg-gray-50"
                                            }>
                                            <td
                                                className={`px-6 py-4 text-sm font-medium ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                                                {prop.prop}
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${
                                                    darkMode ? "text-gray-300" : "text-gray-600"
                                                }`}>
                                                {prop.type}
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                {prop.defaultValue}
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                {prop.description}
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${
                                                    prop.isRequired
                                                        ? darkMode
                                                            ? "text-red-400"
                                                            : "text-red-600"
                                                        : darkMode
                                                          ? "text-gray-500"
                                                          : "text-gray-500"
                                                }`}>
                                                {prop.isRequired ? "Yes" : "No"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <GanttCodeExample
                            title="Basic Props Example"
                            description="Here's how to use some of the most common props."
                            code={codeExamples.coreProps}
                        />
                    </motion.section>

                    {/* Event Handlers Section */}
                    <motion.section
                        id="events"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Event Handlers
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component provides several event handlers to respond to user interactions.
                        </p>

                        {/* New Events Table */}
                        <div
                            className={`overflow-x-auto rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"} mb-8`}>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                                    <tr>
                                        <th
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium ${
                                                darkMode
                                                    ? "text-gray-300 uppercase tracking-wider"
                                                    : "text-gray-500 uppercase tracking-wider"
                                            }`}>
                                            Event Handler
                                        </th>
                                        <th
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium ${
                                                darkMode
                                                    ? "text-gray-300 uppercase tracking-wider"
                                                    : "text-gray-500 uppercase tracking-wider"
                                            }`}>
                                            Type
                                        </th>
                                        <th
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium ${
                                                darkMode
                                                    ? "text-gray-300 uppercase tracking-wider"
                                                    : "text-gray-500 uppercase tracking-wider"
                                            }`}>
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    className={`divide-y ${darkMode ? "divide-gray-700 bg-gray-900" : "divide-gray-200 bg-white"}`}>
                                    {eventsTableData.map((event, index) => (
                                        <tr
                                            key={event.event}
                                            className={
                                                index % 2 === 0
                                                    ? darkMode
                                                        ? "bg-gray-900"
                                                        : "bg-white"
                                                    : darkMode
                                                      ? "bg-gray-800/50"
                                                      : "bg-gray-50"
                                            }>
                                            <td
                                                className={`px-6 py-4 text-sm font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                                {event.event}
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${
                                                    darkMode ? "text-gray-300" : "text-gray-600"
                                                }`}>
                                                {event.type}
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                {event.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <GanttCodeExample
                            title="Event Handlers Example"
                            description="Use these event handlers to respond to user actions."
                            code={codeExamples.eventHandlers}
                        />
                    </motion.section>

                    {/* View Modes Section */}
                    <motion.section
                        id="view-modes"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            View Modes
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component supports five different view modes to adapt to different timeline
                            needs.
                        </p>

                        <CodeExample
                            title="Using View Modes"
                            description="You can specify the view mode using either string literals or the ViewMode enum."
                            code={codeExamples.viewModes}
                            language="jsx"
                        />
                    </motion.section>

                    {/* Customization Section */}
                    <motion.section
                        id="customization"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Customization
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            The GanttChart component offers several ways to customize its appearance.
                        </p>

                        <GanttCodeExample
                            title="Custom Styling"
                            description="Customize the appearance of the Gantt chart using custom class names."
                            code={codeExamples.customStyling}
                        />
                    </motion.section>

                    {/* Custom Rendering Section */}
                    <motion.section
                        id="custom-rendering"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Custom Rendering
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            One of the most powerful features of the GanttChart component is the ability to customize
                            how different parts of the chart are rendered. This allows for complete visual control and
                            advanced functionality.
                        </p>

                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Custom Task Rendering
                            </h3>
                            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                The <code>renderTask</code> prop allows you to completely customize how tasks are
                                displayed in the timeline. This gives you full control over the task's appearance and
                                behavior.
                            </p>

                            <CodeExample
                                title="Custom Task Rendering"
                                description="Replace the default task rendering with your own custom implementation."
                                code={codeExamples.customTaskRender}
                                language="jsx"
                                defaultTab="code"
                            />
                        </div>

                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Custom Tooltip Rendering
                            </h3>
                            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                The <code>renderTooltip</code> prop allows you to customize the tooltip that appears
                                when hovering over a task.
                            </p>

                            <CodeExample
                                title="Custom Tooltip Rendering"
                                description="Create a more detailed and informative tooltip."
                                code={`<GanttChart
  tasks={tasks}
  renderTooltip={({ task, position, dragType, startDate, endDate }) => (
    <div className="custom-tooltip p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700">
      <h3 className="text-lg font-bold dark:text-white">{task.name}</h3>

      {dragType && (
        <div className="my-2 p-1 bg-blue-100 dark:bg-blue-900 rounded text-sm text-blue-800 dark:text-blue-200">
          {dragType === "move" ? "Moving task..." : "Resizing task..."}
        </div>
      )}

      <div className="mt-2 text-sm dark:text-gray-300">
        <span className="font-medium">Duration: </span>
        {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
      </div>

      <div className="mt-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium dark:text-gray-300">Progress: {task.percent || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: \`\${task.percent || 0}%\` }}
          />
        </div>
      </div>

      {task.assignee && (
        <div className="mt-2 text-sm dark:text-gray-300">
          <span className="font-medium">Assigned to: </span>
          {task.assignee}
        </div>
      )}
    </div>
  )}
/>`}
                                language="jsx"
                                defaultTab="code"
                            />
                        </div>

                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Custom Task List Rendering
                            </h3>
                            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                The <code>renderTaskList</code> prop allows you to customize the left sidebar that
                                contains the task groups and descriptions.
                            </p>

                            <CodeExample
                                title="Custom Task List Rendering"
                                description="Customize the left sidebar with additional information or controls."
                                code={`<GanttChart
  tasks={tasks}
  renderTaskList={({ groups }) => (
    <div className="custom-task-list">
      {groups.map(group => (
        <div key={group.id} className="group-item p-3 border-b dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
            <h3 className="font-bold text-gray-900 dark:text-white">{group.name}</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{group.description}</p>

          <div className="mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {group.tasks.length} tasks ({group.tasks.filter(t => t.percent === 100).length} completed)
            </div>

            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-indigo-500 h-1.5 rounded-full"
                style={{
                  width: \`\${
                    group.tasks.length
                      ? (group.tasks.filter(t => t.percent === 100).length / group.tasks.length) * 100
                      : 0
                  }%\`
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
/>`}
                                language="jsx"
                                defaultTab="code"
                            />
                        </div>

                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Dynamic Task Styling with getTaskColor
                            </h3>
                            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                The <code>getTaskColor</code> prop provides a way to dynamically determine a task's
                                colors based on its properties.
                            </p>

                            <CodeExample
                                title="Dynamic Task Styling"
                                description="Change task colors based on their status, priority, or other properties."
                                code={`<GanttChart
  tasks={tasks}
  getTaskColor={({ task }) => {
    // Task is complete
    if (task.percent === 100) {
      return {
        backgroundColor: "#22c55e", // Green
        borderColor: "#166534",
        textColor: "#ffffff",
      };
    }

    // Task has dependencies
    if (task.dependencies?.length > 0) {
      return {
        backgroundColor: "#f59e0b", // Orange
        textColor: "#ffffff",
      };
    }

    // High priority task
    if (task.priority === "high") {
      return {
        backgroundColor: "#ef4444", // Red
        textColor: "#ffffff",
      };
    }

    // Default color
    return {
      backgroundColor: "#3b82f6", // Blue
      textColor: "#ffffff",
    };
  }}
/>`}
                                language="jsx"
                                defaultTab="code"
                            />
                        </div>

                        <div
                            className={`p-4 rounded-lg ${
                                darkMode ? "bg-blue-900/20 border border-blue-800" : "bg-blue-50 border border-blue-200"
                            }`}>
                            <h4 className={`font-medium mb-2 ${darkMode ? "text-blue-300" : "text-blue-800"}`}>
                                Pro Tip: Combining Custom Renderers
                            </h4>
                            <p className={`text-sm ${darkMode ? "text-blue-200" : "text-blue-700"}`}>
                                For maximum customization, you can combine multiple rendering props to create a
                                completely custom Gantt chart experience. This is particularly useful for enterprise
                                applications or when you need to integrate the Gantt chart with your product's design
                                system.
                            </p>
                        </div>
                    </motion.section>

                    {/* Granular Controls Demo Section - NEW */}
                    <motion.section
                        id="granular-controls"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Interactive Granular Controls Demo
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Experiment with the new granular editing controls in real-time. This interactive demo
                            showcases the hierarchical permission system introduced in{" "}
                            <code
                                className={`px-1.5 py-0.5 rounded text-sm ${
                                    darkMode ? "bg-gray-800 text-indigo-400" : "bg-gray-100 text-indigo-600"
                                }`}>
                                react-modern-gantt v0.6.0
                            </code>
                            .
                        </p>

                        <div
                            className={`mb-6 p-4 rounded-lg ${
                                darkMode
                                    ? "bg-amber-900/20 border border-amber-800"
                                    : "bg-amber-50 border border-amber-200"
                            }`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className={`h-5 w-5 ${darkMode ? "text-amber-400" : "text-amber-600"}`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm ${darkMode ? "text-amber-300" : "text-amber-700"}`}>
                                        <strong>Note:</strong> The props shown in this demo (
                                        <code>allowProgressEdit</code>, <code>allowTaskResize</code>,{" "}
                                        <code>allowTaskMove</code>) are available in{" "}
                                        <code>react-modern-gantt v0.6.0+</code>. The demo interface works independently
                                        and shows how these controls will function once you upgrade.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <GranularControlsDemo />

                        <div className="mt-8 space-y-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Key Features
                            </h3>
                            <ul className={`space-y-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                <li className="flex items-start">
                                    <span className="mr-2">🎯</span>
                                    <span>
                                        <strong>Hierarchical Permissions:</strong> The <code>editMode</code> prop acts
                                        as a master switch - when disabled, all editing features are blocked regardless
                                        of individual flag settings.
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">🎨</span>
                                    <span>
                                        <strong>Visual Feedback:</strong> Dependent controls automatically disable when
                                        prerequisites aren't met (e.g., progress editing requires both{" "}
                                        <code>editMode</code> and <code>showProgress</code>).
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">⚡</span>
                                    <span>
                                        <strong>Quick Presets:</strong> Jump to common configurations with one click -
                                        from fully editable to read-only, or anything in between.
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">💻</span>
                                    <span>
                                        <strong>Live Code Preview:</strong> See the exact props configuration needed to
                                        replicate your current settings in real-time.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8 space-y-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Common Use Cases
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div
                                    className={`p-4 rounded-lg border ${
                                        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                    }`}>
                                    <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                        📊 Read-Only Dashboard
                                    </h4>
                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        Display project progress to stakeholders without allowing edits. Set{" "}
                                        <code>editMode=false</code> and <code>showProgress=true</code>.
                                    </p>
                                </div>
                                <div
                                    className={`p-4 rounded-lg border ${
                                        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                    }`}>
                                    <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                        🔒 Restricted Planning
                                    </h4>
                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        Allow task scheduling but prevent duration changes. Enable{" "}
                                        <code>allowTaskMove</code> only.
                                    </p>
                                </div>
                                <div
                                    className={`p-4 rounded-lg border ${
                                        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                    }`}>
                                    <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                        ✏️ Progress Tracking
                                    </h4>
                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        Team members update completion status only. Enable just{" "}
                                        <code>allowProgressEdit</code>.
                                    </p>
                                </div>
                                <div
                                    className={`p-4 rounded-lg border ${
                                        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                    }`}>
                                    <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                        🎯 Role-Based Access
                                    </h4>
                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        Different permissions for different user roles. Combine flags based on user
                                        permissions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Export Functionality Section - NEW */}
                    <motion.section
                        id="export"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Export as Image/PDF
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            React Modern Gantt provides powerful export functionality through the{" "}
                            <code>useGanttExport</code> hook. Export your Gantt charts as PNG, JPEG, or PDF files, copy
                            them to the clipboard, or get them as data URLs for further processing.
                        </p>

                        {/* Installation Requirements */}
                        <div
                            className={`mb-6 p-4 rounded-lg border ${
                                darkMode ? "bg-yellow-900/20 border-yellow-800" : "bg-yellow-50 border-yellow-300"
                            }`}>
                            <h3 className={`font-semibold mb-2 ${darkMode ? "text-yellow-300" : "text-yellow-800"}`}>
                                📦 Required Dependencies
                            </h3>
                            <p className={`text-sm mb-3 ${darkMode ? "text-yellow-200" : "text-yellow-700"}`}>
                                To use the export functionality, you need to install these peer dependencies:
                            </p>
                            <CodeExample
                                title="Install Export Dependencies"
                                description="Run this command to install the required libraries for export functionality."
                                code={`npm install html2canvas jspdf

# or with yarn
yarn add html2canvas jspdf

# or with pnpm
pnpm add html2canvas jspdf`}
                                language="bash"
                            />
                        </div>

                        {/* Basic Usage */}
                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Basic Usage
                            </h3>
                            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                The <code>useGanttExport</code> hook provides all the functionality you need to export
                                your Gantt chart. Simply attach the <code>ganttRef</code> to your GanttChart component
                                and use the export functions.
                            </p>

                            <CodeExample
                                title="Basic Export Example"
                                description="Quick setup to enable PNG and PDF export functionality."
                                code={`import { GanttChart, useGanttExport } from 'react-modern-gantt';

function MyGanttChart() {
  const { ganttRef, exportAsPng, exportAsPdf } = useGanttExport();
  const [tasks] = useState(yourTaskData);

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => exportAsPng('my-gantt-chart')}>
          📥 Export as PNG
        </button>
        <button onClick={() => exportAsPdf('my-gantt-chart')}>
          📄 Export as PDF
        </button>
      </div>

      <GanttChart
        ref={ganttRef}
        tasks={tasks}
        title="My Project Timeline"
      />
    </div>
  );
}`}
                                language="jsx"
                                defaultTab="code"
                            />
                        </div>

                        {/* Available Export Functions */}
                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Available Export Functions
                            </h3>
                            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                The <code>useGanttExport</code> hook returns several functions for different export
                                scenarios:
                            </p>

                            <div
                                className={`overflow-x-auto rounded-lg border ${
                                    darkMode ? "border-gray-700" : "border-gray-200"
                                } mb-6`}>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                                        <tr>
                                            <th
                                                scope="col"
                                                className={`px-6 py-3 text-left text-xs font-medium ${
                                                    darkMode
                                                        ? "text-gray-300 uppercase tracking-wider"
                                                        : "text-gray-500 uppercase tracking-wider"
                                                }`}>
                                                Function
                                            </th>
                                            <th
                                                scope="col"
                                                className={`px-6 py-3 text-left text-xs font-medium ${
                                                    darkMode
                                                        ? "text-gray-300 uppercase tracking-wider"
                                                        : "text-gray-500 uppercase tracking-wider"
                                                }`}>
                                                Description
                                            </th>
                                            <th
                                                scope="col"
                                                className={`px-6 py-3 text-left text-xs font-medium ${
                                                    darkMode
                                                        ? "text-gray-300 uppercase tracking-wider"
                                                        : "text-gray-500 uppercase tracking-wider"
                                                }`}>
                                                Returns
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className={`divide-y ${
                                            darkMode ? "divide-gray-700 bg-gray-900" : "divide-gray-200 bg-white"
                                        }`}>
                                        <tr className={darkMode ? "bg-gray-900" : "bg-white"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                                exportAsPng(filename)
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Downloads the chart as a PNG file
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                Promise&lt;void&gt;
                                            </td>
                                        </tr>
                                        <tr className={darkMode ? "bg-gray-800/50" : "bg-gray-50"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                                exportAsJpeg(filename)
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Downloads the chart as a JPEG file
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                Promise&lt;void&gt;
                                            </td>
                                        </tr>
                                        <tr className={darkMode ? "bg-gray-900" : "bg-white"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                                exportAsPdf(filename)
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Downloads the chart as a PDF file
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                Promise&lt;void&gt;
                                            </td>
                                        </tr>
                                        <tr className={darkMode ? "bg-gray-800/50" : "bg-gray-50"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                                getDataUrl(format)
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Returns a base64 data URL of the chart
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                Promise&lt;string&gt;
                                            </td>
                                        </tr>
                                        <tr className={darkMode ? "bg-gray-900" : "bg-white"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                                copyToClipboard()
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Copies the chart image to clipboard
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                Promise&lt;void&gt;
                                            </td>
                                        </tr>
                                        <tr className={darkMode ? "bg-gray-800/50" : "bg-gray-50"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                                checkDependencies()
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Checks if export dependencies are installed
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                Promise&lt;object&gt;
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Advanced Export Options */}
                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Advanced Export Options
                            </h3>
                            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Use the <code>exportChart</code> function for fine-grained control over export settings
                                like quality, scale, and background color.
                            </p>

                            <CodeExample
                                title="Custom Export with Options"
                                description="Configure export quality, resolution, and appearance."
                                code={`import { GanttChart, useGanttExport } from 'react-modern-gantt';

function MyGanttChart({ darkMode }) {
  const { ganttRef, exportChart } = useGanttExport();
  const [tasks] = useState(yourTaskData);

  const handleCustomExport = async () => {
    try {
      await exportChart({
        format: 'png',              // 'png', 'jpeg', or 'pdf'
        filename: 'project-timeline',
        quality: 0.95,              // 0.0 to 1.0 (for JPEG)
        scale: 2,                   // Higher = better resolution
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      });
      console.log('Export successful!');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCustomExport}>
        📥 Export High-Res PNG
      </button>

      <GanttChart
        ref={ganttRef}
        tasks={tasks}
        darkMode={darkMode}
      />
    </div>
  );
}`}
                                language="jsx"
                                defaultTab="code"
                            />
                        </div>

                        {/* Export Options Reference */}
                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Export Options Reference
                            </h3>

                            <div
                                className={`overflow-x-auto rounded-lg border ${
                                    darkMode ? "border-gray-700" : "border-gray-200"
                                } mb-6`}>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                                        <tr>
                                            <th
                                                scope="col"
                                                className={`px-6 py-3 text-left text-xs font-medium ${
                                                    darkMode
                                                        ? "text-gray-300 uppercase tracking-wider"
                                                        : "text-gray-500 uppercase tracking-wider"
                                                }`}>
                                                Option
                                            </th>
                                            <th
                                                scope="col"
                                                className={`px-6 py-3 text-left text-xs font-medium ${
                                                    darkMode
                                                        ? "text-gray-300 uppercase tracking-wider"
                                                        : "text-gray-500 uppercase tracking-wider"
                                                }`}>
                                                Type
                                            </th>
                                            <th
                                                scope="col"
                                                className={`px-6 py-3 text-left text-xs font-medium ${
                                                    darkMode
                                                        ? "text-gray-300 uppercase tracking-wider"
                                                        : "text-gray-500 uppercase tracking-wider"
                                                }`}>
                                                Default
                                            </th>
                                            <th
                                                scope="col"
                                                className={`px-6 py-3 text-left text-xs font-medium ${
                                                    darkMode
                                                        ? "text-gray-300 uppercase tracking-wider"
                                                        : "text-gray-500 uppercase tracking-wider"
                                                }`}>
                                                Description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className={`divide-y ${
                                            darkMode ? "divide-gray-700 bg-gray-900" : "divide-gray-200 bg-white"
                                        }`}>
                                        <tr className={darkMode ? "bg-gray-900" : "bg-white"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                                                format
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                'png' | 'jpeg' | 'pdf'
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                png
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Export file format
                                            </td>
                                        </tr>
                                        <tr className={darkMode ? "bg-gray-800/50" : "bg-gray-50"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                                                filename
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                string
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                'gantt-chart'
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Name of the downloaded file (without extension)
                                            </td>
                                        </tr>
                                        <tr className={darkMode ? "bg-gray-900" : "bg-white"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                                                quality
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                number
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                0.92
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Image quality (0.0 to 1.0, JPEG only)
                                            </td>
                                        </tr>
                                        <tr className={darkMode ? "bg-gray-800/50" : "bg-gray-50"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                                                scale
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                number
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                1
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Resolution multiplier (2 = 2x resolution)
                                            </td>
                                        </tr>
                                        <tr className={darkMode ? "bg-gray-900" : "bg-white"}>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                                                backgroundColor
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-mono text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                string
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                '#ffffff'
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Background color for the exported image
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Complete Export Example */}
                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Complete Export Implementation
                            </h3>
                            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Here's a comprehensive example showing dependency checking, error handling, and multiple
                                export options:
                            </p>

                            <CodeExample
                                title="Full Export Feature Implementation"
                                description="Complete example with dependency checking, status messages, and error handling."
                                code={`import React, { useState, useEffect } from 'react';
import { GanttChart, useGanttExport } from 'react-modern-gantt';

function ExportableGantt({ darkMode, tasks }) {
  const [exportStatus, setExportStatus] = useState('');
  const [dependencies, setDependencies] = useState(null);

  const {
    ganttRef,
    exportChart,
    exportAsPng,
    exportAsJpeg,
    exportAsPdf,
    getDataUrl,
    copyToClipboard,
    checkDependencies,
  } = useGanttExport();

  // Check dependencies on mount
  useEffect(() => {
    const checkLibs = async () => {
      const deps = await checkDependencies();
      setDependencies(deps);
    };
    checkLibs();
  }, [checkDependencies]);

  // Export handler with status
  const handleExport = async (exportFn, action) => {
    setExportStatus(\`Exporting \${action}...\`);
    try {
      await exportFn();
      setExportStatus(\`✓ \${action} exported successfully!\`);
    } catch (error) {
      setExportStatus(\`✗ Error: \${error.message}\`);
    }
    setTimeout(() => setExportStatus(''), 3000);
  };

  return (
    <div>
      {/* Dependency Status */}
      {dependencies && (
        <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: darkMode ? '#374151' : '#f3f4f6', borderRadius: '8px' }}>
          <strong>Export Dependencies:</strong>
          <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
            <li>html2canvas: {dependencies.html2canvas ? '✓ Available' : '✗ Not installed'}</li>
            <li>jsPDF: {dependencies.jspdf ? '✓ Available' : '✗ Not installed'}</li>
          </ul>
          {(!dependencies.html2canvas || !dependencies.jspdf) && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>
              Install missing: <code>npm install html2canvas jspdf</code>
            </p>
          )}
        </div>
      )}

      {/* Export Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          onClick={() => handleExport(() => exportAsPng('gantt'), 'PNG')}
          disabled={!dependencies?.html2canvas}>
          📥 Export PNG
        </button>
        <button
          onClick={() => handleExport(() => exportAsJpeg('gantt'), 'JPEG')}
          disabled={!dependencies?.html2canvas}>
          🖼️ Export JPEG
        </button>
        <button
          onClick={() => handleExport(() => exportAsPdf('gantt'), 'PDF')}
          disabled={!dependencies?.html2canvas || !dependencies?.jspdf}>
          📄 Export PDF
        </button>
        <button
          onClick={() => handleExport(() => copyToClipboard(), 'Copy')}
          disabled={!dependencies?.html2canvas}>
          📋 Copy to Clipboard
        </button>
      </div>

      {/* Export Status */}
      {exportStatus && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: exportStatus.startsWith('✓') ? '#10b981' :
                          exportStatus.startsWith('✗') ? '#ef4444' : '#3b82f6',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {exportStatus}
        </div>
      )}

      {/* Gantt Chart */}
      <GanttChart
        ref={ganttRef}
        tasks={tasks}
        title="Exportable Gantt Chart"
        darkMode={darkMode}
        showProgress={true}
      />
    </div>
  );
}`}
                                language="jsx"
                                defaultTab="code"
                            />
                        </div>

                        {/* Best Practices */}
                        <div
                            className={`p-4 rounded-lg ${
                                darkMode ? "bg-blue-900/20 border border-blue-800" : "bg-blue-50 border border-blue-200"
                            }`}>
                            <h4 className={`font-medium mb-2 ${darkMode ? "text-blue-300" : "text-blue-800"}`}>
                                💡 Export Best Practices
                            </h4>
                            <ul
                                className={`text-sm space-y-1 ml-5 list-disc ${darkMode ? "text-blue-200" : "text-blue-700"}`}>
                                <li>
                                    Always check dependencies with <code>checkDependencies()</code> before showing
                                    export buttons
                                </li>
                                <li>
                                    Use <code>scale: 2</code> or higher for high-resolution exports suitable for
                                    printing
                                </li>
                                <li>
                                    Set appropriate background colors to match your theme (especially important for dark
                                    mode)
                                </li>
                                <li>Handle errors gracefully and provide user feedback during the export process</li>
                                <li>For large Gantt charts, warn users that export might take a few seconds</li>
                                <li>
                                    Use PNG for transparency, JPEG for smaller file sizes, and PDF for document
                                    integration
                                </li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Examples Section */}
                    <motion.section
                        id="examples"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Complete Code Example
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Here's a complete example showing how to use the GanttChart component with state management
                            and event handling. Notice the CSS import at the top!
                        </p>

                        <GanttCodeExample
                            title="Complete Example"
                            description="A full implementation of the GanttChart with state management and styling."
                            code={codeExamples.completeExample}
                        />
                    </motion.section>

                    {/* Troubleshooting Section - NEW */}
                    <motion.section
                        id="troubleshooting"
                        className="mb-16 scroll-mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Troubleshooting
                        </h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Here are solutions to common issues you might encounter when using the GanttChart component.
                        </p>

                        <div
                            className={`p-4 border-l-4 mb-6 ${
                                darkMode
                                    ? "bg-gray-800 border-indigo-500 text-indigo-300"
                                    : "bg-indigo-50 border-indigo-500 text-indigo-700"
                            }`}>
                            <h3 className="font-bold mb-2">Missing Styles</h3>
                            <p className="text-sm mb-2">
                                The most common issue is forgetting to import the CSS file. If your Gantt chart appears
                                unstyled (no borders, colors, or proper layout), you need to import the CSS.
                            </p>
                            <CodeExample
                                title="Fix Missing Styles"
                                description="Make sure you've imported the CSS file in your application."
                                code={codeExamples.troubleshooting}
                                language="javascript"
                            />
                        </div>

                        <div
                            className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} border ${
                                darkMode ? "border-gray-700" : "border-gray-200"
                            }`}>
                            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Common Issues
                            </h3>
                            <ul className={`ml-5 list-disc space-y-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                <li>
                                    <strong>Missing Styles:</strong> Import the CSS file with{" "}
                                    <code className={`px-1 rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                        import "react-modern-gantt/dist/index.css"
                                    </code>
                                </li>
                                <li>
                                    <strong>Invalid Date Objects:</strong> Ensure all dates are valid JavaScript Date
                                    objects
                                </li>
                                <li>
                                    <strong>Task ID Conflicts:</strong> Make sure each task has a unique ID within the
                                    entire dataset
                                </li>
                                <li>
                                    <strong>Incorrect Data Structure:</strong> Verify your data follows the Task and
                                    TaskGroup interfaces
                                </li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Back to top button with animation */}
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className={`inline-flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                                darkMode
                                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}>
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                            </svg>
                            Back to Top
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ComponentsPage;
