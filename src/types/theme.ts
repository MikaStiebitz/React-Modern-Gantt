import { GanttStyles } from "@/types";

// Theme interface for consistent styling
export interface GanttTheme {
    colors: {
        // Base colors
        background: string;
        text: string;
        border: string;
        highlight: string;

        // Task colors
        task: {
            background: string;
            text: string;
            border: string;
            progress: string;
            progressFill: string;
        };

        // Timeline colors
        timeline: {
            background: string;
            headerBackground: string;
            headerText: string;
            marker: string;
        };

        // Scrollbar
        scrollbar: {
            track: string;
            thumb: string;
            thumbHover: string;
        };
    };

    // Sizing and spacing
    sizes: {
        rowHeight: number;
        taskHeight: number;
        unitWidth: {
            minute: number;
            hour: number;
            day: number;
            week: number;
            month: number;
            quarter: number;
            year: number;
        };
        borderRadius: string;
        fontSize: string;
    };

    // Animation settings
    animation: {
        speed: number;
        easing: string;
    };
}

// Default light theme
export const lightTheme: GanttTheme = {
    colors: {
        background: "#ffffff",
        text: "#1f2937",
        border: "#e5e7eb",
        highlight: "#eff6ff",

        task: {
            background: "#3b82f6",
            text: "#ffffff",
            border: "#2563eb",
            progress: "rgba(0, 0, 0, 0.2)",
            progressFill: "#ffffff",
        },

        timeline: {
            background: "#ffffff",
            headerBackground: "#f9fafb",
            headerText: "#1f2937",
            marker: "#ef4444",
        },

        scrollbar: {
            track: "rgba(229, 231, 235, 0.5)",
            thumb: "rgba(156, 163, 175, 0.7)",
            thumbHover: "rgba(107, 114, 128, 0.8)",
        },
    },

    sizes: {
        rowHeight: 40,
        taskHeight: 32,
        unitWidth: {
            minute: 30,
            hour: 40,
            day: 50,
            week: 80,
            month: 150,
            quarter: 180,
            year: 200,
        },
        borderRadius: "4px",
        fontSize: "0.875rem",
    },

    animation: {
        speed: 0.25,
        easing: "cubic-bezier(0.2, 0, 0.13, 2)",
    },
};

// Default dark theme - based on light theme with overrides
export const darkTheme: GanttTheme = {
    ...lightTheme,
    colors: {
        background: "#1f2937",
        text: "#f3f4f6",
        border: "#374151",
        highlight: "#2d3748",

        task: {
            background: "#4f46e5",
            text: "#ffffff",
            border: "#6366f1",
            progress: "rgba(0, 0, 0, 0.3)",
            progressFill: "#e5e7eb",
        },

        timeline: {
            background: "#1f2937",
            headerBackground: "#111827",
            headerText: "#e5e7eb",
            marker: "#ef4444",
        },

        scrollbar: {
            track: "rgba(55, 65, 81, 0.5)",
            thumb: "rgba(75, 85, 99, 0.7)",
            thumbHover: "rgba(107, 114, 128, 0.8)",
        },
    },
};

// Convert a theme object to CSS variables
export function themeToCssVariables(theme: GanttTheme, isRoot = true): string {
    const prefix = isRoot ? ":root" : "";

    return `
${prefix} {
  /* Base colors */
  --rmg-bg-color: ${theme.colors.background};
  --rmg-text-color: ${theme.colors.text};
  --rmg-border-color: ${theme.colors.border};
  --rmg-highlight-color: ${theme.colors.highlight};

  /* Task colors */
  --rmg-task-bg-color: ${theme.colors.task.background};
  --rmg-task-text-color: ${theme.colors.task.text};
  --rmg-task-border-color: ${theme.colors.task.border};
  --rmg-task-progress-color: ${theme.colors.task.progress};
  --rmg-task-progress-fill-color: ${theme.colors.task.progressFill};

  /* Timeline colors */
  --rmg-timeline-bg-color: ${theme.colors.timeline.background};
  --rmg-timeline-header-bg-color: ${theme.colors.timeline.headerBackground};
  --rmg-timeline-header-text-color: ${theme.colors.timeline.headerText};
  --rmg-timeline-marker-color: ${theme.colors.timeline.marker};

  /* Scrollbar colors */
  --rmg-scrollbar-track-color: ${theme.colors.scrollbar.track};
  --rmg-scrollbar-thumb-color: ${theme.colors.scrollbar.thumb};
  --rmg-scrollbar-thumb-hover-color: ${theme.colors.scrollbar.thumbHover};

  /* Sizes */
  --rmg-row-height: ${theme.sizes.rowHeight}px;
  --rmg-task-height: ${theme.sizes.taskHeight}px;
  --rmg-border-radius: ${theme.sizes.borderRadius};
  --rmg-font-size: ${theme.sizes.fontSize};

  /* Unit widths by view mode */
  --rmg-unit-width-minute: ${theme.sizes.unitWidth.minute}px;
  --rmg-unit-width-hour: ${theme.sizes.unitWidth.hour}px;
  --rmg-unit-width-day: ${theme.sizes.unitWidth.day}px;
  --rmg-unit-width-week: ${theme.sizes.unitWidth.week}px;
  --rmg-unit-width-month: ${theme.sizes.unitWidth.month}px;
  --rmg-unit-width-quarter: ${theme.sizes.unitWidth.quarter}px;
  --rmg-unit-width-year: ${theme.sizes.unitWidth.year}px;

  /* Animation */
  --rmg-animation-speed: ${theme.animation.speed};
  --rmg-animation-easing: ${theme.animation.easing};
}
`;
}

// Generate the default CSS variables
export const defaultCssVariables = themeToCssVariables(lightTheme);
export const darkCssVariables = themeToCssVariables(darkTheme);

// Helper function to merge custom theme with defaults
export function mergeThemes(customTheme: Partial<GanttTheme>, isDark = false): GanttTheme {
    const baseTheme = isDark ? darkTheme : lightTheme;

    return {
        colors: {
            ...baseTheme.colors,
            ...customTheme.colors,
            task: {
                ...baseTheme.colors.task,
                ...customTheme.colors?.task,
            },
            timeline: {
                ...baseTheme.colors.timeline,
                ...customTheme.colors?.timeline,
            },
            scrollbar: {
                ...baseTheme.colors.scrollbar,
                ...customTheme.colors?.scrollbar,
            },
        },
        sizes: {
            ...baseTheme.sizes,
            ...customTheme.sizes,
            unitWidth: {
                ...baseTheme.sizes.unitWidth,
                ...customTheme.sizes?.unitWidth,
            },
        },
        animation: {
            ...baseTheme.animation,
            ...customTheme.animation,
        },
    };
}

// Helper function to convert GanttStyles to class names
export function applyStyles(styles: GanttStyles | undefined, defaultClasses: string): string {
    if (!styles) return defaultClasses;

    return defaultClasses;
}

// Convert styles object to Tailwind utility classes
export function convertStylesToTailwind(theme: GanttTheme): Record<string, string> {
    return {
        container: `bg-[${theme.colors.background}] text-[${theme.colors.text}] border-[${theme.colors.border}] rounded-[${theme.sizes.borderRadius}]`,
        taskItem: `bg-[${theme.colors.task.background}] text-[${theme.colors.task.text}] rounded-[${theme.sizes.borderRadius}]`,
        timeline: `bg-[${theme.colors.timeline.background}]`,
        todayMarker: `bg-[${theme.colors.timeline.marker}]`,
        scrollbar: `bg-[${theme.colors.scrollbar.track}]`,
        scrollbarThumb: `bg-[${theme.colors.scrollbar.thumb}]`,
    };
}
