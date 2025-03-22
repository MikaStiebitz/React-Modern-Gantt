import { TaskGroup, ViewMode } from "@/types";
interface UseTimeUnitsProps {
    customStartDate?: Date;
    customEndDate?: Date;
    tasks: TaskGroup[];
    activeViewMode: ViewMode;
    currentDate: Date;
    minuteStep?: number;
}
/**
 * Hook for calculating time units based on view mode
 */
export declare const useTimeUnits: ({ customStartDate, customEndDate, tasks, activeViewMode, currentDate, minuteStep, }: UseTimeUnitsProps) => {
    derivedStartDate: Date;
    derivedEndDate: Date;
    timeUnits: Date[];
    totalUnits: number;
    currentUnitIndex: number;
};
export {};
