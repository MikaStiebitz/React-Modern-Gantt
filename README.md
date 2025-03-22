# React Modern Gantt

A flexible, customizable Gantt chart component for React applications with drag-and-drop task scheduling, dark mode support, progress tracking, and multiple view modes.

[![npm version](https://img.shields.io/npm/v/react-modern-gantt.svg)](https://www.npmjs.com/package/react-modern-gantt)
[![license](https://img.shields.io/npm/l/react-modern-gantt.svg)](https://github.com/MikaStiebitz/React-Modern-Gantt/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-modern-gantt.svg)](https://bundlephobia.com/result?p=react-modern-gantt)

![Dark Mode Preview](https://github.com/user-attachments/assets/110b971a-0386-42b8-a237-d7d1d6eae132)

<a href="https://react-gantt-demo.vercel.app/" target="_blank" rel="noopener noreferrer">LIVE DEMO</a>

## Features

- 📊 **Interactive timeline** with drag-and-drop task scheduling
- 🎨 **Fully customizable** with Tailwind CSS or custom styling
- 🕒 **Multiple view modes** (Minute, Hour, Day, Week, Month, Quarter, Year)
- 🌙 **Dark mode support** built-in
- 📱 **Responsive design** that works across devices
- 📈 **Progress tracking** with visual indicators and interactive updates
- 🔄 **Task dependencies** and relationship management
- 🎯 **Event handling** for clicks, updates, selections
- 🧩 **Composable API** with extensive custom render props for advanced customization
- 🌊 **Smooth animations** with configurable speeds and thresholds
- 🔄 **Auto-scrolling** during drag operations

## Compatibility

React Modern Gantt is designed to be compatible with a wide range of project setups:

- **React**: Works with React 17, 18, and 19
- **Next.js**: Full support for Next.js 13/14 (including App Router)
- **Tailwind CSS**: Compatible with both Tailwind CSS v3 and v4
- **TypeScript/JavaScript**: Full TypeScript type definitions included, but works perfectly with JavaScript projects too

## Installation & Usage

### Simple Installation

```bash
npm install react-modern-gantt
# or
yarn add react-modern-gantt
```

### Zero-Configuration Usage

```jsx
import GanttChart from "react-modern-gantt";
import "react-modern-gantt/dist/index.css"; // Import styles if not using Tailwind

function MyApp() {
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

    return <GanttChart tasks={tasks} onTaskUpdate={handleTaskUpdate} />;
}
```

### Next.js Usage (App Router)

```jsx
// app/gantt/page.jsx
"use client";

import { NextGanttChart } from "react-modern-gantt/nextjs";
import "react-modern-gantt/dist/index.css"; // Import styles if not using Tailwind

export default function GanttPage() {
    const tasks = [
        // Your tasks here
    ];

    return (
        <NextGanttChart
            tasks={tasks}
            onTaskUpdate={(groupId, task) => {
                /* Handle updates */
            }}
        />
    );
}
```

### Advanced Usage Options

```jsx
// Standard GanttChart component
import { GanttChart } from "react-modern-gantt";
import "react-modern-gantt/dist/index.css";

// Full import with all utilities
import { GanttChart, ViewMode, TaskService, CollisionService } from "react-modern-gantt";

// Next.js specific version
import { NextGanttChart } from "react-modern-gantt/nextjs";
```

### Typescript Support

Full TypeScript definitions are included:

```tsx
import { GanttChart, Task, TaskGroup, ViewMode } from "react-modern-gantt";

// Define your tasks with proper typing
const tasks: TaskGroup[] = [
    // Your typed tasks here
];
```

## Core Concepts

React Modern Gantt is built around a few key concepts:

1. **Task Groups** - Collections of tasks, typically representing teams or departments
2. **Tasks** - Individual work items with start and end dates
3. **View Modes** - Different timeline scales (Minute, Hour, Day, Week, Month, Quarter, Year)
4. **Interactions** - Drag, resize, click, and other user interactions

## Component Props

### GanttChart

The main component for rendering a Gantt chart.

#### Data and Configuration Props

| Prop                    | Type          | Default              | Description                                              |
| ----------------------- | ------------- | -------------------- | -------------------------------------------------------- |
| `tasks`                 | `TaskGroup[]` | `[]`                 | Array of task groups                                     |
| `startDate`             | `Date`        | Auto                 | Start date of the chart (defaults to earliest task date) |
| `endDate`               | `Date`        | Auto                 | End date of the chart (defaults to latest task date)     |
| `title`                 | `string`      | `"Project Timeline"` | Title displayed at the top of the chart                  |
| `currentDate`           | `Date`        | `new Date()`         | Current date for the today marker                        |
| `showCurrentDateMarker` | `boolean`     | `true`               | Whether to show the today marker                         |
| `todayLabel`            | `string`      | `"Today"`            | Label for today marker                                   |
| `editMode`              | `boolean`     | `true`               | Whether tasks can be dragged/resized                     |
| `headerLabel`           | `string`      | `"Resources"`        | Header label for the task list column                    |
| `showProgress`          | `boolean`     | `false`              | Whether to show progress indicators                      |
| `darkMode`              | `boolean`     | `false`              | Whether to use dark mode                                 |
| `locale`                | `string`      | `'default'`          | Locale for date formatting                               |
| `viewMode`              | `ViewMode`    | `ViewMode.MONTH`     | Timeline display mode (day, week, month, quarter, year)  |
| `showViewModeSelector`  | `boolean`     | `true`               | Whether to show the view mode selector                   |
| `smoothDragging`        | `boolean`     | `true`               | Enable smooth animations for dragging operations         |
| `movementThreshold`     | `number`      | `3`                  | Minimum pixel movement threshold to reduce jitter        |
| `animationSpeed`        | `number`      | `0.25`               | Animation speed for smooth transitions (0.1-1)           |
| `fontSize`              | `string`      | `'inherit'`          | Base font size                                           |
| `rowHeight`             | `number`      | `40`                 | Height of task rows in pixels                            |
| `styles`                | `GanttStyles` | `{}`                 | Custom style classes                                     |

#### Custom Render Props

These props allow advanced customization of each component part:

| Prop                     | Type                                                                       | Description                             |
| ------------------------ | -------------------------------------------------------------------------- | --------------------------------------- |
| `renderTaskList`         | `(props: TaskListRenderProps) => ReactNode`                                | Custom render for the task list sidebar |
| `renderTask`             | `(props: TaskRenderProps) => ReactNode`                                    | Custom render for individual task bars  |
| `renderTooltip`          | `(props: TooltipRenderProps) => ReactNode`                                 | Custom render for task tooltips         |
| `renderViewModeSelector` | `(props: ViewModeSelectorRenderProps) => ReactNode`                        | Custom render for view mode tabs        |
| `renderHeader`           | `(props: HeaderRenderProps) => ReactNode`                                  | Custom render for the chart header      |
| `renderTimelineHeader`   | `(props: TimelineHeaderRenderProps) => ReactNode`                          | Custom render for timeline header       |
| `getTaskColor`           | `(props: TaskColorProps) => { backgroundColor, borderColor?, textColor? }` | Customize task colors                   |

#### Event Handlers

| Prop                | Type                                           | Description                                               |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| `onTaskUpdate`      | `(groupId: string, updatedTask: Task) => void` | Called when a task is moved, resized, or progress updated |
| `onTaskClick`       | `(task: Task, group: TaskGroup) => void`       | Called when a task is clicked                             |
| `onTaskSelect`      | `(task: Task, isSelected: boolean) => void`    | Called when a task is selected                            |
| `onTaskDoubleClick` | `(task: Task) => void`                         | Called when a task is double-clicked                      |
| `onGroupClick`      | `(group: TaskGroup) => void`                   | Called when a group is clicked                            |
| `onViewModeChange`  | `(viewMode: ViewMode) => void`                 | Called when view mode changes                             |

## Task and TaskGroup Interfaces

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

## View Modes

The component supports seven different view modes to adapt to different timeline needs:

| View Mode | Description            | Best Used For                                |
| --------- | ---------------------- | -------------------------------------------- |
| `MINUTE`  | Shows minutes          | Ultra-detailed short-term planning (hours)   |
| `HOUR`    | Shows hours            | Detailed tracking (hours/days)               |
| `DAY`     | Shows individual days  | Detailed short-term planning (days/weeks)    |
| `WEEK`    | Shows weeks            | Short to medium-term planning (weeks/months) |
| `MONTH`   | Shows months (default) | Medium-term planning (months/quarters)       |
| `QUARTER` | Shows quarters         | Medium to long-term planning (quarters/year) |
| `YEAR`    | Shows years            | Long-term planning (years)                   |

```jsx
import { GanttChart, ViewMode } from "react-modern-gantt";

// Using string literals
<GanttChart tasks={tasks} viewMode="day" />

// Using the ViewMode enum
<GanttChart tasks={tasks} viewMode={ViewMode.DAY} />
```

## Customization

### Using Custom Styles

React Modern Gantt supports easy customization with Tailwind CSS classes or your own CSS:

```jsx
<GanttChart
    tasks={tasks}
    styles={{
        container: "border-2 border-blue-200",
        title: "text-2xl text-blue-800",
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

### Tailwind CSS Integration

#### With Tailwind CSS v3

Configure content paths in your `tailwind.config.js`:

```js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/react-modern-gantt/**/*.{js,jsx,ts,tsx}"],
    // ...rest of your config
};
```

#### With Tailwind CSS v4

For Tailwind v4, you can use either the content option (similar to v3) or the new pattern-based config:

```js
export default {
    content: {
        files: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/react-modern-gantt/**/*.{js,jsx,ts,tsx}"],
    },
    // ...rest of your config
};
```

Or if you're using the new patterns approach:

```js
export default {
    content: {
        // Maintain standard patterns
        relative: ["./src/**/*.{js,jsx,ts,tsx}"],
        // Add package to monitored directories
        packages: ["react-modern-gantt"],
    },
    // ...rest of your config
};
```

## Handling Task Updates

Handle task updates with custom logic:

```jsx
const handleTaskUpdate = (groupId, updatedTask) => {
    // Validate dates
    if (updatedTask.startDate > updatedTask.endDate) {
        alert("Start date cannot be after end date");
        return;
    }

    // Check for progress updates
    const originalTask = tasks.find(group => group.id === groupId)?.tasks.find(task => task.id === updatedTask.id);

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

## Exported Utility Functions and Classes

React Modern Gantt exports several utility functions and classes:

### Common Utility Functions

| Function                | Description                                  |
| ----------------------- | -------------------------------------------- |
| `formatDate`            | Format a date with different display options |
| `getMonthsBetween`      | Get array of months between two dates        |
| `getDaysInMonth`        | Get number of days in a month                |
| `detectTaskOverlaps`    | Detect and group overlapping tasks           |
| `calculateTaskPosition` | Calculate position of a task                 |
| `formatDateRange`       | Format a date range as a string              |
| `calculateDuration`     | Calculate duration between two dates         |
| `findEarliestDate`      | Find earliest date in task groups            |
| `findLatestDate`        | Find latest date in task groups              |

### Utility Classes

```jsx
import { TaskService, CollisionService } from "react-modern-gantt";

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

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
