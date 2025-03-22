import { useState, useMemo, useCallback } from "react";
import { ViewMode } from "@/types";

interface UseViewModeProps {
    initialViewMode?: ViewMode;
    viewModes?: ViewMode[] | false;
    onViewModeChange?: (mode: ViewMode) => void;
}

/**
 * Hook for managing view mode and view mode selection
 */
export const useViewMode = ({ initialViewMode = ViewMode.MONTH, viewModes, onViewModeChange }: UseViewModeProps) => {
    // State for active view mode
    const [activeViewMode, setActiveViewMode] = useState<ViewMode>(initialViewMode);

    // Get available view modes based on props
    const availableViewModes = useMemo(() => {
        // If viewModes is explicitly set to false, return false to hide selector
        if (viewModes === false) {
            return false;
        }

        // If viewModes is provided as an array, use it
        if (Array.isArray(viewModes)) {
            return viewModes;
        }

        // Default standard view modes
        return [ViewMode.DAY, ViewMode.WEEK, ViewMode.MONTH, ViewMode.QUARTER, ViewMode.YEAR];
    }, [viewModes]);

    // Determine if we should show the view mode selector
    const shouldShowViewModeSelector = availableViewModes !== false;

    // Handle view mode change
    const handleViewModeChange = useCallback(
        (newMode: ViewMode) => {
            setActiveViewMode(newMode);

            if (onViewModeChange) {
                onViewModeChange(newMode);
            }
        },
        [onViewModeChange]
    );

    return {
        activeViewMode,
        handleViewModeChange,
        shouldShowViewModeSelector,
        availableViewModes,
    };
};
