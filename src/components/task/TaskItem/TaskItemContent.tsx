import React from "react";
import { Task } from "@/types";

interface TaskItemContentProps {
    task: Task;
    getTaskColor?: any;
    isHovered: boolean;
    isDragging: boolean;
}

/**
 * TaskItemContent Component - Renders the content of a task item
 */
const TaskItemContent: React.FC<TaskItemContentProps> = ({ task, getTaskColor, isHovered, isDragging }) => {
    // Get task colors - either from custom function or default
    let backgroundColor = task.color || "var(--rmg-task-bg-color)";
    let borderColor = "";
    let textColor = "var(--rmg-task-text-color)";

    if (getTaskColor) {
        const colors = getTaskColor({ task, isHovered, isDragging });
        backgroundColor = colors.backgroundColor;
        borderColor = colors.borderColor || "";
        textColor = colors.textColor || textColor;
    }

    // Apply colors as either classes or inline styles
    const bgColorStyle = backgroundColor.startsWith("bg-") ? {} : { backgroundColor };
    const bgColorClass = backgroundColor.startsWith("bg-") ? backgroundColor : "";

    const borderColorStyle = borderColor
        ? borderColor.startsWith("border-")
            ? {}
            : { borderColor, borderWidth: "1px" }
        : {};
    const borderColorClass = borderColor && borderColor.startsWith("border-") ? borderColor : "";

    const textColorStyle = textColor.startsWith("text-") ? {} : { color: textColor };
    const textColorClass = textColor.startsWith("text-") ? textColor : "";

    return (
        <div
            className={`truncate select-none ${bgColorClass} ${borderColorClass} ${textColorClass}`}
            style={{
                ...bgColorStyle,
                ...borderColorStyle,
                ...textColorStyle,
            }}>
            {task.name || "Unnamed Task"}
        </div>
    );
};

export default TaskItemContent;
