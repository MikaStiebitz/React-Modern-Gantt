import React from "react";
import { ViewMode } from "@/types";

interface ViewModeSelectorProps {
  activeMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  darkMode: boolean;
  availableModes?: ViewMode[];
}

/**
 * ViewModeSelector Component - Allows switching between different timeline views
 */
const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  activeMode,
  onChange,
  darkMode,
  availableModes,
}) => {
  // All possible view modes
  const allViewModes = [
    { id: ViewMode.MINUTE, label: "Minute" },
    { id: ViewMode.HOUR, label: "Hour" },
    { id: ViewMode.DAY, label: "Day" },
    { id: ViewMode.WEEK, label: "Week" },
    { id: ViewMode.MONTH, label: "Month" },
    { id: ViewMode.QUARTER, label: "Quarter" },
    { id: ViewMode.YEAR, label: "Year" },
  ];

  // Default standard view modes (excluding MINUTE and HOUR)
  const standardViewModes = [
    ViewMode.DAY,
    ViewMode.WEEK,
    ViewMode.MONTH,
    ViewMode.QUARTER,
    ViewMode.YEAR,
  ];

  // Filter view modes based on availableModes prop if provided
  // Otherwise use the standard view modes
  const viewModes = availableModes
    ? allViewModes.filter((mode) => availableModes.includes(mode.id))
    : allViewModes.filter((mode) => standardViewModes.includes(mode.id));

  return (
    <div
      className={`rmg-view-mode-selector ${darkMode ? "rmg-dark" : ""}`}
      data-rmg-component="view-mode-selector"
    >
      {viewModes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          className={`rmg-view-mode-button ${activeMode === mode.id ? "rmg-view-mode-button-active" : ""}`}
          onClick={() => onChange(mode.id)}
          data-rmg-component="view-mode-button"
          data-view-mode={mode.id}
          data-active={activeMode === mode.id ? "true" : "false"}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ViewModeSelector;
