import React from "react";
import { ViewMode } from "../utils/types";
declare const ViewModeSelector: React.FC<{
    activeMode: ViewMode;
    onChange: (mode: ViewMode) => void;
    darkMode: boolean;
    availableModes?: ViewMode[];
}>;
export default ViewModeSelector;
