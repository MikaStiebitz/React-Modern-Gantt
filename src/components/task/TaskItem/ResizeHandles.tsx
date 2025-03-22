import React from "react";

interface ResizeHandlesProps {
    onResizeLeft: (e: React.MouseEvent) => void;
    onResizeRight: (e: React.MouseEvent) => void;
}

/**
 * ResizeHandles Component - Renders the resize handles for a task
 */
const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResizeLeft, onResizeRight }) => {
    return (
        <>
            <div className="rmg-resize-handle rmg-resize-handle-left" onMouseDown={onResizeLeft} />
            <div className="rmg-resize-handle rmg-resize-handle-right" onMouseDown={onResizeRight} />
        </>
    );
};

export default ResizeHandles;
