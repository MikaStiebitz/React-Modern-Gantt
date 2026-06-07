import { createElement } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import GanttDemo from "../components/demo/GanttDemo";
import CodeExample from "../components/demo/CodeExample";

// Update the component type definition to be compatible with React 19
const HomePage = (): ReactElement => {
    const { darkMode } = useTheme();

    // Basic usage example code with CSS import clearly highlighted
    const basicUsageCode = `import React, { useState } from 'react';
import { GanttChart, Task, TaskGroup } from 'react-modern-gantt';
// ⚠️ IMPORTANT: Don't forget to import the styles!
import 'react-modern-gantt/dist/index.css';

const MyGanttComponent = () => {
  // Define your task data
  const tasks = [
    {
      id: "team-1",
      name: "Engineering",
      description: "Development Team",
      tasks: [
        {
          id: "task-1",
          name: "Website Redesign",
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 2, 15),
          color: "#3B82F6", // blue-500
          percent: 75,
        },
        // More tasks...
      ],
    },
    // More groups...
  ];

  // Task update handler
  const handleTaskUpdate = (groupId, updatedTask) => {
    // Update your task data here
    console.log("Task updated:", updatedTask);
  };

  return (
    <GanttChart
      tasks={tasks}
      title="Project Timeline"
      showProgress={true}
      onTaskUpdate={handleTaskUpdate}
      viewMode="month" // Options: "day", "week", "month", "quarter", "year"
    />
  );
};`;

    // Installation code including CSS import note
    const installationCode = `# Install the package
npm install react-modern-gantt

# or with yarn
yarn add react-modern-gantt`;

    // New section for CSS import
    const cssImportCode = `// In your main component or entry file:
import 'react-modern-gantt/dist/index.css';

// Alternative: reference in HTML
// <link rel="stylesheet" href="https://unpkg.com/react-modern-gantt@0.5.0/dist/index.css" />`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1
                    className={`text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 ${
                        darkMode ? "text-white" : "text-gray-900"
                    }`}>
                    React Modern Gantt
                </h1>
                <p className={`text-xl max-w-3xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    A flexible, customizable Gantt chart component for React applications with drag-and-drop task
                    scheduling, dark mode support, and multiple view modes.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <a
                        href="https://github.com/MikaStiebitz/React-Modern-Gantt/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-6 py-3 rounded-md text-base font-medium ${
                            darkMode
                                ? "bg-indigo-700 text-white hover:bg-indigo-800"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                        } transition-colors`}>
                        GitHub
                    </a>
                    <Link
                        to="/components"
                        className={`px-6 py-3 rounded-md text-base font-medium ${
                            darkMode
                                ? "bg-gray-700 text-white hover:bg-gray-800"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } transition-colors`}>
                        View Documentation
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="mb-16">
                <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Key Features
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature cards */}
                    {[
                        {
                            title: "Interactive Timeline",
                            desc: "Drag-and-drop task scheduling with intuitive controls for resizing and rescheduling tasks.",
                        },
                        {
                            title: "Multiple View Modes",
                            desc: "Day, Week, Month, Quarter, and Year view modes to fit your project timeline needs.",
                        },
                        {
                            title: "Customizable Design",
                            desc: "Flexible styling options with dark mode support and responsive design for all screen sizes.",
                        },
                        {
                            title: "Progress Tracking",
                            desc: "Visual indicators and interactive updates for task completion percentages.",
                        },
                        {
                            title: "Task Dependencies",
                            desc: "Support for tracking and visualizing dependencies between tasks.",
                        },
                        {
                            title: "Event Handling",
                            desc: "Comprehensive event handling for clicks, updates, and selections.",
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {feature.title}
                            </h3>
                            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Demo Section */}
            <div className="mb-16">
                <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Interactive Demo
                </h2>
                {createElement(GanttDemo)}
            </div>

            {/* Installation Section */}
            <div className="mb-16" id="installation">
                <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>Installation</h2>
                {createElement(CodeExample, {
                    title: "Install with npm or yarn",
                    description: "Add React Modern Gantt to your project using npm or yarn.",
                    code: installationCode,
                    language: "bash",
                })}

                {/* New CSS Import Section */}
                <div className="mt-8">
                    <div
                        className={`p-4 border-l-4 mb-6 ${
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

                    {createElement(CodeExample, {
                        title: "Import the CSS",
                        description:
                            "The Gantt chart requires CSS styles that are shipped separately from the component code.",
                        code: cssImportCode,
                        language: "javascript",
                    })}
                </div>
            </div>

            {/* Basic Usage Section */}
            <div className="mb-16">
                <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>Basic Usage</h2>
                {createElement(CodeExample, {
                    title: "Simple Implementation",
                    description: "A basic example of using the GanttChart component. Note the CSS import at the top!",
                    code: basicUsageCode,
                    language: "jsx",
                })}
            </div>

            {/* Troubleshooting Section - New */}
            <div className="mb-16">
                <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Common Issues
                </h2>

                <div className={`p-6 rounded-lg shadow-md mb-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Missing Styles
                    </h3>
                    <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        If your Gantt chart appears without styling (no colors, borders or proper layout), make sure
                        you've imported the CSS file:
                    </p>
                    <div className={`p-4 rounded-md font-mono text-sm ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        import "react-modern-gantt/dist/index.css";
                    </div>
                    <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        This import should be included in your application's entry point or in the component where you
                        use the Gantt chart.
                    </p>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Ready to Build Impressive Project Timelines?
                </h2>
                <p className={`mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Explore the full capabilities of React Modern Gantt and start creating interactive timelines today.
                </p>
                <Link
                    to="/components"
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${
                        darkMode
                            ? "bg-indigo-700 text-white hover:bg-indigo-800"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } transition-colors`}>
                    View Component Documentation
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
