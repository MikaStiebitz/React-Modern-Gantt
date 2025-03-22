# React Modern Gantt

A flexible, customizable Gantt chart component for React applications with drag-and-drop task scheduling, dark mode support, progress tracking, and multiple view modes.

[![npm version](https://img.shields.io/npm/v/react-modern-gantt.svg)](https://www.npmjs.com/package/react-modern-gantt)
[![license](https://img.shields.io/npm/l/react-modern-gantt.svg)](https://github.com/MikaStiebitz/React-Modern-Gantt/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-modern-gantt.svg)](https://bundlephobia.com/result?p=react-modern-gantt)

![Dark Mode Preview](https://github.com/user-attachments/assets/110b971a-0386-42b8-a237-d7d1d6eae132)

<a href="https://react-gantt-demo.vercel.app/" target="_blank" rel="noopener noreferrer">LIVE DEMO</a>

## 🎯 Features

- 📊 **Interactive timeline** with drag-and-drop task scheduling
- 🎨 **Fully customizable** with CSS variables, Tailwind CSS, or custom styling
- 🧩 **Multiple view modes** (Minute, Hour, Day, Week, Month, Quarter, Year)
- 🌙 **Dark mode support** built-in
- 📱 **Responsive design** that works across devices
- 📈 **Progress tracking** with visual indicators and interactive updates
- 🔄 **Task dependencies** and relationship management
- ✨ **Advanced animations** with configurable speeds and thresholds
- 🎯 **Event handling** for clicks, updates, selections
- 🧩 **Composable API** with extensive custom render props for advanced customization
- 🔄 **Auto-scrolling** during drag operations

## 📦 Compatibility

React Modern Gantt is designed for a wide range of modern project setups:

- **React**: Compatible with React 17, 18, and 19
- **Next.js**: First-class support for Next.js 13/14+ (including App Router)
- **Tailwind CSS**: Works with both Tailwind CSS v3 and v4
- **TypeScript/JavaScript**: Full TypeScript types included (TS v4/v5), works with JavaScript too
- **Styling**: Use with or without Tailwind - standalone CSS included

## 📥 Installation & Quick Start

### Installation

```bash
# npm
npm install react-modern-gantt

# yarn
yarn add react-modern-gantt

# pnpm
pnpm add react-modern-gantt
```

### Basic Usage

```jsx
import { GanttChart } from "react-modern-gantt";
// Import included CSS (not needed if using Tailwind)
import "react-modern-gantt/dist/index.css";

function App() {
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
                    color: "bg-blue-500",
                    percent: 75,
                },
                // More tasks...
            ],
        },
        // More groups...
    ];

    const handleTaskUpdate = (groupId, updatedTask) => {
        console.log("Task updated:", updatedTask);
        // Update your state here
    };

    return (
        <GanttChart
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            darkMode={false}
            viewMode="month"
            showProgress={true}
        />
    );
}
```

### Usage with Next.js (App Router)

```jsx
// app/gantt/page.js
"use client";

import { NextGanttChart } from "react-modern-gantt";
import "react-modern-gantt/dist/index.css";

export default function GanttPage() {
    // Your task data and handlers...

    return <NextGanttChart tasks={tasks} onTaskUpdate={handleTaskUpdate} darkMode={false} />;
}
```

## 🧩 Core Concepts

React Modern Gantt is built around a few key concepts:

1. **Task Groups** - Collections of tasks, typically representing teams or departments
2. **Tasks** - Individual work items with start and end dates
3. **View Modes** - Different timeline scales (Minute, Hour, Day, Week, Month, Quarter, Year)
4. **Interactions** - Drag, resize, click, and other user interactions

## 📄 Task and TaskGroup Interfaces

```typescript
interface Task {
    id: string; // Unique identifier
    name: string; // Task name
    startDate: Date; // Start date
    endDate: Date; // End date
    color?: string; // Task color (Tailwind class or CSS color)
    percent?: number; // Completion percentage (0-100)
    dependencies?: string[]; // IDs of dependent tasks
    [key: string]: any; // Additional custom properties
}

interface TaskGroup {
    id: string; // Unique identifier
    name: string; // Group name
    description?: string; // Group description
    icon?: string; // Optional icon (HTML string)
    tasks: Task[]; // Array of tasks in this group
    [key: string]: any; // Additional custom properties
}
```

## 🖼️ View Modes

The component supports seven different view modes to adapt to different timeline needs:

| View Mode | Description              | Best Used For                                |
| --------- | ------------------------ | -------------------------------------------- |
| `MINUTE`  | Shows individual minutes | Detailed short-term planning (minutes/hours) |
| `HOUR`    | Shows hours              | Short-term planning (hours/days)             |
| `DAY`     | Shows individual days    | Detailed short-term planning (days/weeks)    |
| `WEEK`    | Shows weeks              | Short to medium-term planning (weeks/months) |
| `MONTH`   | Shows months (default)   | Medium-term planning (months/quarters)       |
| `QUARTER` | Shows quarters           | Medium to long-term planning (quarters/year) |
| `YEAR`    | Shows years              | Long-term planning (years)                   |

```jsx
import { GanttChart, ViewMode } from "react-modern-gantt";

// Using string literals
<GanttChart tasks={tasks} viewMode="day" />

// Using the ViewMode enum
<GanttChart tasks={tasks} viewMode={ViewMode.DAY} />
```

## ⚙️ Component Props

### GanttChart

| Prop                    | Type                    | Default              | Description                                              |
| ----------------------- | ----------------------- | -------------------- | -------------------------------------------------------- |
| `tasks`                 | `TaskGroup[]`           | `[]`                 | Array of task groups                                     |
| `startDate`             | `Date`                  | Auto                 | Start date of the chart (defaults to earliest task date) |
| `endDate`               | `Date`                  | Auto                 | End date of the chart (defaults to latest task date)     |
| `title`                 | `string`                | `"Project Timeline"` | Title displayed at the top of the chart                  |
| `currentDate`           | `Date`                  | `new Date()`         | Current date for the today marker                        |
| `showCurrentDateMarker` | `boolean`               | `true`               | Whether to show the today marker                         |
| `todayLabel`            | `string`                | `"Today"`            | Label for today marker                                   |
| `editMode`              | `boolean`               | `true`               | Whether tasks can be dragged/resized                     |
| `headerLabel`           | `string`                | `"Resources"`        | Header label for the task list column                    |
| `showProgress`          | `boolean`               | `false`              | Whether to show progress indicators                      |
| `darkMode`              | `boolean`               | `false`              | Whether to use dark mode                                 |
| `locale`                | `string`                | `'default'`          | Locale for date formatting                               |
| `viewMode`              | `ViewMode`              | `ViewMode.MONTH`     | Timeline display mode                                    |
| `viewModes`             | `ViewMode[]` \| `false` | Standard modes       | Available view modes, or `false` to hide selector        |
| `smoothDragging`        | `boolean`               | `true`               | Enable smooth animations for dragging operations         |
| `movementThreshold`     | `number`                | `3`                  | Minimum pixel movement threshold to reduce jitter        |
| `animationSpeed`        | `number`                | `0.25`               | Animation speed for smooth transitions (0.1-1)           |
| `fontSize`              | `string`                | `'inherit'`          | Base font size                                           |
| `rowHeight`             | `number`                | `40`                 | Height of task rows in pixels                            |
| `styles`                | `GanttStyles`           | `{}`                 | Custom style classes                                     |
| `theme`                 | `Partial<GanttTheme>`   | `{}`                 | Theme customization object                               |

### Event Handlers

| Prop                | Type                                           | Description                                               |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| `onTaskUpdate`      | `(groupId: string, updatedTask: Task) => void` | Called when a task is moved, resized, or progress updated |
| `onTaskClick`       | `(task: Task, group: TaskGroup) => void`       | Called when a task is clicked                             |
| `onTaskSelect`      | `(task: Task, isSelected: boolean) => void`    | Called when a task is selected                            |
| `onTaskDoubleClick` | `(task: Task) => void`                         | Called when a task is double-clicked                      |
| `onGroupClick`      | `(group: TaskGroup) => void`                   | Called when a group is clicked                            |
| `onViewModeChange`  | `(viewMode: ViewMode) => void`                 | Called when view mode changes                             |

### Custom Render Props

| Prop                     | Type                                                                       | Description                             |
| ------------------------ | -------------------------------------------------------------------------- | --------------------------------------- |
| `renderTaskList`         | `(props: TaskListRenderProps) => ReactNode`                                | Custom render for the task list sidebar |
| `renderTask`             | `(props: TaskRenderProps) => ReactNode`                                    | Custom render for individual task bars  |
| `renderTooltip`          | `(props: TooltipRenderProps) => ReactNode`                                 | Custom render for task tooltips         |
| `renderViewModeSelector` | `(props: ViewModeSelectorRenderProps) => ReactNode`                        | Custom render for view mode tabs        |
| `renderHeader`           | `(props: HeaderRenderProps) => ReactNode`                                  | Custom render for the chart header      |
| `renderTimelineHeader`   | `(props: TimelineHeaderRenderProps) => ReactNode`                          | Custom render for timeline header       |
| `getTaskColor`           | `(props: TaskColorProps) => { backgroundColor, borderColor?, textColor? }` | Customize task colors                   |

## 🎨 Customization

### Using Theme System

React Modern Gantt provides a powerful theming system:

```jsx
<GanttChart
    tasks={tasks}
    theme={{
        colors: {
            task: {
                background: "#4f46e5", // Change task background color
                text: "#ffffff", // Change task text color
            },
            timeline: {
                marker: "#dc2626", // Change today marker color
            },
        },
        sizes: {
            rowHeight: 50, // Taller rows
            borderRadius: "8px", // Rounder corners
        },
        animation: {
            speed: 0.3, // Slightly slower animations
        },
    }}
    onTaskUpdate={handleTaskUpdate}
/>
```

### Using Tailwind CSS Classes

You can customize with Tailwind CSS classes:

```jsx
<GanttChart
    tasks={tasks}
    styles={{
        container: "border-2 border-blue-200 rounded-xl",
        title: "text-2xl text-blue-800 font-bold",
        taskList: "bg-blue-50",
        timeline: "bg-gray-50",
        todayMarker: "bg-red-500",
        taskRow: "hover:bg-slate-50",
        tooltip: "shadow-lg",
    }}
    onTaskUpdate={handleTaskUpdate}
/>
```

### Dark Mode

Dark mode is built-in and easy to enable:

```jsx
<GanttChart tasks={tasks} darkMode={true} onTaskUpdate={handleTaskUpdate} />
```

### Custom CSS Variables

For global styling, you can override CSS variables:

```css
/* In your CSS file */
:root {
    --rmg-bg-color: #f8fafc;
    --rmg-text-color: #334155;
    --rmg-border-color: #cbd5e1;
    --rmg-task-bg-color: #3b82f6;
    --rmg-task-text-color: #ffffff;
    --rmg-timeline-marker-color: #ef4444;
}

/* Dark mode overrides */
.dark {
    --rmg-bg-color: #1e293b;
    --rmg-text-color: #f1f5f9;
    --rmg-border-color: #475569;
    --rmg-task-bg-color: #4f46e5;
    --rmg-task-text-color: #ffffff;
}
```

### Custom Task Rendering

Fully customize task appearance:

```jsx
<GanttChart
    tasks={tasks}
    renderTask={({ task, leftPx, widthPx, topPx, isHovered, isDragging, showProgress }) => (
        <div
            className={`absolute h-8 rounded flex items-center px-2
        ${isHovered ? "ring-2 ring-blue-500" : ""}
        ${task.color || "bg-blue-500"}`}
            style={{
                left: `${leftPx}px`,
                width: `${widthPx}px`,
                top: `${topPx}px`,
            }}>
            <div className="text-white truncate">{task.name}</div>
            {showProgress && (
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/20 rounded-full">
                    <div className="h-full bg-white/80 rounded-full" style={{ width: `${task.percent || 0}%` }} />
                </div>
            )}
        </div>
    )}
/>
```

## ✅ Handling Task Updates

Handle task updates with validation:

```jsx
const handleTaskUpdate = (groupId, updatedTask) => {
    // Validate dates
    if (updatedTask.startDate > updatedTask.endDate) {
        alert("Start date cannot be after end date");
        return;
    }

    // Check for progress updates
    const originalTask = findTaskById(updatedTask.id);

    if (originalTask && originalTask.percent !== updatedTask.percent) {
        console.log(`Progress updated: ${originalTask.percent}% → ${updatedTask.percent}%`);
    }

    // Update state
    setTasks(prevTasks =>
        prevTasks.map(group =>
            group.id === groupId
                ? {
                      ...group,
                      tasks: group.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
                  }
                : group
        )
    );
};
```

## 🔍 Advanced Examples

### Using Multiple View Modes

```jsx
import { useState } from "react";
import { GanttChart, ViewMode } from "react-modern-gantt";

function MultiViewGantt() {
    const [viewMode, setViewMode] = useState(ViewMode.MONTH);

    const handleViewModeChange = newMode => {
        setViewMode(newMode);
    };

    return (
        <GanttChart
            tasks={tasks}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            // Only show Day, Month and Year options
            viewModes={[ViewMode.DAY, ViewMode.MONTH, ViewMode.YEAR]}
        />
    );
}
```

### Custom Header

```jsx
<GanttChart
    tasks={tasks}
    renderHeader={({ title, darkMode, viewMode, onViewModeChange }) => (
        <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                {title}
            </h1>
            <div className="flex space-x-4 items-center">
                <span className="text-sm text-gray-500">Current view:</span>
                <select
                    value={viewMode}
                    onChange={e => onViewModeChange(e.target.value)}
                    className="border rounded p-1">
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="quarter">Quarter</option>
                    <option value="year">Year</option>
                </select>
            </div>
        </div>
    )}
/>
```

## 🛠️ Exported Utility Functions and Classes

```jsx
import { TaskService, CollisionService, formatDate, getMonthsBetween, calculateTaskPosition } from "react-modern-gantt";

// Calculate task position
const { leftPx, widthPx } = TaskService.calculateTaskPixelPosition(
    task,
    startDate,
    endDate,
    totalMonths,
    monthWidth,
    ViewMode.MONTH
);

// Check for collisions
const wouldCollide = CollisionService.wouldCollide(taskToMove, allTasks, ViewMode.MONTH);
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
