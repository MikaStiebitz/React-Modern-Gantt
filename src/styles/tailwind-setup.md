# Tailwind CSS Integration

React Modern Gantt can be used with both Tailwind CSS v3 and v4. Here's how to configure it properly for each version.

## Tailwind CSS v3

For Tailwind CSS v3, you need to include the component paths in your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Your project files
        "./node_modules/react-modern-gantt/**/*.{js,jsx,ts,tsx}", // Gantt chart components
    ],
    theme: {
        extend: {
            // Optional: extend with Gantt chart colors for custom styling
            colors: {
                "gantt-bg": "var(--rmg-bg-color, var(--color-gantt-bg))",
                "gantt-text": "var(--rmg-text-color, var(--color-gantt-text))",
                "gantt-border": "var(--rmg-border-color, var(--color-gantt-border))",
                "gantt-task": "var(--rmg-task-bg-color, var(--color-gantt-task))",
            },
        },
    },
    plugins: [],
};
```

## Tailwind CSS v4

Tailwind CSS v4 has a different approach to configuration. Since it no longer requires a `tailwind.config.js` file, you can use the following methods:

### Option 1: Using the Tailwind CLI (Recommended)

In your project, create a CSS file (e.g., `tailwind.css`) with these imports:

```css
@import "tailwindcss";

/* Import Gantt chart CSS */
@import "react-modern-gantt/dist/index.css";

/* Optional: Add Gantt chart color variables for custom styling */
:root {
    --rmg-bg-color: #ffffff;
    --rmg-text-color: #1f2937;
    --rmg-border-color: #e5e7eb;
    --rmg-task-bg-color: #3b82f6;
    --rmg-task-text-color: #ffffff;
}

/* Define content for Tailwind to scan */
@config {
    content:
        [ "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/react-modern-gantt/**/*.{js,jsx,ts,tsx}"];
}
```

Then run the Tailwind CLI to build your CSS:

```bash
npx tailwindcss -i tailwind.css -o styles.css
```

### Option 2: Using PostCSS

If you're using PostCSS, add this to your `postcss.config.js`:

```js
module.exports = {
    plugins: {
        tailwindcss: {
            content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/react-modern-gantt/**/*.{js,jsx,ts,tsx}"],
        },
        autoprefixer: {},
    },
};
```

### Option 3: Import Our Tailwind Config

We provide a ready-to-use configuration for Tailwind that you can import:

```js
// For Tailwind v3
const ganttTailwindConfig = require("react-modern-gantt/tailwind.config.setup");

// Extend your config with ours
module.exports = {
    content: [
        ...ganttTailwindConfig.content,
        "./src/**/*.{js,jsx,ts,tsx}", // Your own files
    ],
    theme: {
        extend: {
            ...ganttTailwindConfig.theme.extend,
            // Your custom theme extensions
        },
    },
};
```

For Tailwind v4 with JS API:

```js
import { createTailwindConfig } from "tailwindcss";
import { ganttTailwindContent } from "react-modern-gantt/tailwind.v4.js";

export default createTailwindConfig({
    content: [
        ...ganttTailwindContent,
        "./src/**/*.{js,jsx,ts,tsx}", // Your own files
    ],
    // Rest of your config
});
```

## Using Without Tailwind

If you're not using Tailwind CSS, you can simply import our standalone CSS:

```js
import "react-modern-gantt/dist/index.css";
```

The component will work perfectly without Tailwind CSS, as we provide all the necessary styling.

// File: src/tailwind.v4.js - Helper for Tailwind v4 users
/\*\*

- Helper file for Tailwind v4 configuration
  \*/

// Array of files to scan for Tailwind CSS classes
export const ganttTailwindContent = [
"./node_modules/react-modern-gantt/**/*.{js,jsx,ts,tsx}",
];

// Export component colors for Tailwind v4 theme
export const ganttTailwindColors = {
"gantt-bg": "var(--rmg-bg-color, var(--color-gantt-bg))",
"gantt-text": "var(--rmg-text-color, var(--color-gantt-text))",
"gantt-border": "var(--rmg-border-color, var(--color-gantt-border))",
"gantt-highlight": "var(--rmg-highlight-color, var(--color-gantt-highlight))",
"gantt-marker": "var(--rmg-timeline-marker-color, var(--color-gantt-marker))",
"gantt-task": "var(--rmg-task-bg-color, var(--color-gantt-task))",
"gantt-task-text": "var(--rmg-task-text-color, var(--color-gantt-task-text))",
};
