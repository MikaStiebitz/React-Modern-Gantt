/**
 * Predefined themes for React Modern Gantt
 * These can be applied to customize the appearance without custom CSS
 */

export interface GanttTheme {
  // Base colors
  bgColor: string;
  textColor: string;
  borderColor: string;
  highlightColor: string;
  markerColor: string;

  // Task colors
  taskColor: string;
  taskTextColor: string;

  // UI elements
  tooltipBgColor: string;
  tooltipTextColor: string;
  tooltipBorderColor: string;

  // Progress indicators
  progressBgColor: string;
  progressFillColor: string;

  // Shadows and effects
  shadowColor: string;
  shadowHoverColor: string;
  shadowDragColor: string;

  // Scrollbar colors
  scrollbarTrackColor: string;
  scrollbarThumbColor: string;
  scrollbarThumbHoverColor: string;
}

/**
 * Default light theme
 */
export const defaultTheme: GanttTheme = {
  bgColor: "#ffffff",
  textColor: "#1f2937",
  borderColor: "#e5e7eb",
  highlightColor: "#eff6ff",
  markerColor: "#ef4444",

  taskColor: "#3b82f6",
  taskTextColor: "#ffffff",

  tooltipBgColor: "#ffffff",
  tooltipTextColor: "#1f2937",
  tooltipBorderColor: "#e5e7eb",

  progressBgColor: "rgba(0, 0, 0, 0.2)",
  progressFillColor: "#ffffff",

  shadowColor: "rgba(0, 0, 0, 0.1)",
  shadowHoverColor: "rgba(0, 0, 0, 0.2)",
  shadowDragColor: "rgba(0, 0, 0, 0.3)",

  scrollbarTrackColor: "rgba(229, 231, 235, 0.5)",
  scrollbarThumbColor: "rgba(156, 163, 175, 0.7)",
  scrollbarThumbHoverColor: "rgba(107, 114, 128, 0.8)",
};

/**
 * Dark theme
 */
export const darkTheme: GanttTheme = {
  bgColor: "#1f2937",
  textColor: "#f3f4f6",
  borderColor: "#374151",
  highlightColor: "#374151",
  markerColor: "#ef4444",

  taskColor: "#4f46e5",
  taskTextColor: "#ffffff",

  tooltipBgColor: "#1f2937",
  tooltipTextColor: "#f3f4f6",
  tooltipBorderColor: "#374151",

  progressBgColor: "rgba(255, 255, 255, 0.3)",
  progressFillColor: "#d1d5db",

  shadowColor: "rgba(0, 0, 0, 0.3)",
  shadowHoverColor: "rgba(0, 0, 0, 0.4)",
  shadowDragColor: "rgba(0, 0, 0, 0.5)",

  scrollbarTrackColor: "rgba(55, 65, 81, 0.5)",
  scrollbarThumbColor: "rgba(75, 85, 99, 0.7)",
  scrollbarThumbHoverColor: "rgba(107, 114, 128, 0.8)",
};

/**
 * Material design inspired theme
 */
export const materialTheme: GanttTheme = {
  bgColor: "#fafafa",
  textColor: "#212121",
  borderColor: "#e0e0e0",
  highlightColor: "#e3f2fd",
  markerColor: "#f44336",

  taskColor: "#2196f3",
  taskTextColor: "#ffffff",

  tooltipBgColor: "#ffffff",
  tooltipTextColor: "#212121",
  tooltipBorderColor: "#e0e0e0",

  progressBgColor: "rgba(0, 0, 0, 0.12)",
  progressFillColor: "#ffffff",

  shadowColor: "rgba(0, 0, 0, 0.08)",
  shadowHoverColor: "rgba(0, 0, 0, 0.15)",
  shadowDragColor: "rgba(0, 0, 0, 0.25)",

  scrollbarTrackColor: "rgba(224, 224, 224, 0.5)",
  scrollbarThumbColor: "rgba(158, 158, 158, 0.7)",
  scrollbarThumbHoverColor: "rgba(117, 117, 117, 0.8)",
};

/**
 * Applies a theme to your Gantt chart by setting CSS variables
 * @param theme The theme to apply
 * @param selector Optional CSS selector to target (defaults to :root)
 */
export function applyTheme(
  theme: GanttTheme,
  selector: string = ":root",
): void {
  // Ensure we're in a browser environment
  if (typeof document === "undefined") return;

  // Get the target element
  const target =
    selector === ":root"
      ? document.documentElement
      : (document.querySelector(selector) as HTMLElement); // Type assertion als HTMLElement

  if (!target) return;

  // Apply the theme variables
  target.style.setProperty("--rmg-bg-color", theme.bgColor);
  target.style.setProperty("--rmg-text-color", theme.textColor);
  target.style.setProperty("--rmg-border-color", theme.borderColor);
  target.style.setProperty("--rmg-highlight-color", theme.highlightColor);
  target.style.setProperty("--rmg-marker-color", theme.markerColor);

  target.style.setProperty("--rmg-task-color", theme.taskColor);
  target.style.setProperty("--rmg-task-text-color", theme.taskTextColor);

  target.style.setProperty("--rmg-tooltip-bg", theme.tooltipBgColor);
  target.style.setProperty("--rmg-tooltip-text", theme.tooltipTextColor);
  target.style.setProperty("--rmg-tooltip-border", theme.tooltipBorderColor);

  target.style.setProperty("--rmg-progress-bg", theme.progressBgColor);
  target.style.setProperty("--rmg-progress-fill", theme.progressFillColor);

  target.style.setProperty("--rmg-shadow-color", theme.shadowColor);
  target.style.setProperty("--rmg-shadow-hover", theme.shadowHoverColor);
  target.style.setProperty("--rmg-shadow-drag", theme.shadowDragColor);

  target.style.setProperty("--rmg-scrollbar-track", theme.scrollbarTrackColor);
  target.style.setProperty("--rmg-scrollbar-thumb", theme.scrollbarThumbColor);
  target.style.setProperty(
    "--rmg-scrollbar-thumb-hover",
    theme.scrollbarThumbHoverColor,
  );
}
