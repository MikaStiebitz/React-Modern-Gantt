import { GanttStyles } from "@/types";
export interface GanttTheme {
    colors: {
        background: string;
        text: string;
        border: string;
        highlight: string;
        task: {
            background: string;
            text: string;
            border: string;
            progress: string;
            progressFill: string;
        };
        timeline: {
            background: string;
            headerBackground: string;
            headerText: string;
            marker: string;
        };
        scrollbar: {
            track: string;
            thumb: string;
            thumbHover: string;
        };
    };
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
    animation: {
        speed: number;
        easing: string;
    };
}
export declare const lightTheme: GanttTheme;
export declare const darkTheme: GanttTheme;
export declare function themeToCssVariables(theme: GanttTheme, isRoot?: boolean): string;
export declare const defaultCssVariables: string;
export declare const darkCssVariables: string;
export declare function mergeThemes(customTheme: Partial<GanttTheme>, isDark?: boolean): GanttTheme;
export declare function applyStyles(styles: GanttStyles | undefined, defaultClasses: string): string;
export declare function convertStylesToTailwind(theme: GanttTheme): Record<string, string>;
