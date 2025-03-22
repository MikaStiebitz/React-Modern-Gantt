import React from "react";
interface ResizeHandlesProps {
    onResizeLeft: (e: React.MouseEvent) => void;
    onResizeRight: (e: React.MouseEvent) => void;
}
/**
 * ResizeHandles Component - Renders the resize handles for a task
 */
declare const ResizeHandles: React.FC<ResizeHandlesProps>;
export default ResizeHandles;
