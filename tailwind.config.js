/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class", // Allow users to switch to dark mode
    theme: {
        extend: {
            colors: {
                "gantt-bg": "var(--rmg-bg-color, var(--color-gantt-bg))",
                "gantt-text": "var(--rmg-text-color, var(--color-gantt-text))",
                "gantt-border": "var(--rmg-border-color, var(--color-gantt-border))",
                "gantt-highlight": "var(--rmg-highlight-color, var(--color-gantt-highlight))",
                "gantt-marker": "var(--rmg-timeline-marker-color, var(--color-gantt-marker))",
                "gantt-task": "var(--rmg-task-bg-color, var(--color-gantt-task))",
                "gantt-task-text": "var(--rmg-task-text-color, var(--color-gantt-task-text))",
            },
        },
    },
    plugins: [],
    // This special flag enables compatibility with both v3 and v4
    // It will be ignored by v3 but used by v4
    future: {
        // Any future flags needed for v4
    },
    // Make sure v3 users don't see any warnings about future flags
    corePlugins: {
        // v3 core plugins if needed
    },
};
