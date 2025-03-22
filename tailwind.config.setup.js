module.exports = {
    content: [
        // Add this to include the gantt chart components
        "./node_modules/react-modern-gantt/**/*.{js,jsx,ts,tsx}",
    ],
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
    // This ensures forward compatibility with Tailwind v4
    future: {
        // Any future flags needed for v4
    },
};
