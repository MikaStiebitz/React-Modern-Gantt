import { ViewMode } from "@/types";
interface UseViewModeProps {
    initialViewMode?: ViewMode;
    viewModes?: ViewMode[] | false;
    onViewModeChange?: (mode: ViewMode) => void;
}
/**
 * Hook for managing view mode and view mode selection
 */
export declare const useViewMode: ({ initialViewMode, viewModes, onViewModeChange }: UseViewModeProps) => {
    activeViewMode: ViewMode;
    handleViewModeChange: (newMode: ViewMode) => void;
    shouldShowViewModeSelector: boolean;
    availableViewModes: boolean | ViewMode[];
};
export {};
