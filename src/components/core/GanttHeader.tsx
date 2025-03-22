import React from "react";
import { ViewMode } from "@/types";
import { ViewModeSelector } from "@/components/ui";

interface GanttHeaderProps {
    title: string;
    darkMode: boolean;
    activeViewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    showViewModeSelector: boolean;
    availableViewModes: ViewMode[] | boolean;
    renderHeader?: any;
    renderViewModeSelector?: any;
    styles: any;
}

/**
 * GanttHeader Component - Renders the header section of the Gantt chart
 */
export const GanttHeader: React.FC<GanttHeaderProps> = ({
    title,
    darkMode,
    activeViewMode,
    onViewModeChange,
    showViewModeSelector,
    availableViewModes,
    renderHeader,
    renderViewModeSelector,
    styles,
}) => {
    // Custom render function for the header
    if (renderHeader) {
        return renderHeader({
            title,
            darkMode,
            viewMode: activeViewMode,
            onViewModeChange,
            showViewModeSelector,
        });
    }

    return (
        <div className={`p-6 border-b border-gantt-border bg-gantt-bg ${styles.header || ""}`}>
            <div className="flex justify-between items-center">
                <h1 className={`text-2xl font-bold text-gantt-text ${styles.title || ""}`}>{title}</h1>

                {showViewModeSelector && (
                    <div className="flex space-x-2">
                        {renderViewModeSelector ? (
                            renderViewModeSelector({
                                activeMode: activeViewMode,
                                onChange: onViewModeChange,
                                darkMode,
                                availableModes: availableViewModes as ViewMode[],
                            })
                        ) : (
                            <ViewModeSelector
                                activeMode={activeViewMode}
                                onChange={onViewModeChange}
                                darkMode={darkMode}
                                availableModes={availableViewModes as ViewMode[]}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
