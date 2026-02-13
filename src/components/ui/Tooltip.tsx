import React from "react";
import { ViewMode, TooltipRenderProps } from "@/types";
import { TaskService } from "@/services";
import { TooltipProps } from "@/types";
import { format } from "date-fns";
import { getDuration } from "@/utils/dateUtils";

/**
 * Tooltip Component - Shows task information on hover
 */
const Tooltip: React.FC<
  TooltipProps & {
    renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
  }
> = ({
  task,
  position,
  dragType,
  taskId,
  startDate,
  endDate,
  totalMonths,
  monthWidth,
  showProgress = false,
  instanceId,
  className = "",
  viewMode = ViewMode.MONTH,
  renderTooltip,
}) => {
  // Default values
  let displayStartDate = task.startDate;
  let displayEndDate = task.endDate;

  try {
    // If the task is being dragged/resized, get the live dates from element position
    const id = taskId || task.id;
    const taskEl = document.querySelector(
      `[data-task-id="${id}"][data-instance-id="${instanceId}"]`,
    ) as HTMLElement;

    if (taskEl && (dragType || taskEl.style.left || taskEl.style.width)) {
      const dates = TaskService.getLiveDatesFromElement(
        taskEl,
        startDate,
        endDate,
        totalMonths,
        monthWidth,
        viewMode,
      );
      displayStartDate = dates.startDate;
      displayEndDate = dates.endDate;
    }
  } catch (error) {
    console.error("Error calculating live dates for tooltip:", error);
  }

  // Calculate duration based on view mode
  const duration = getDuration(displayStartDate, displayEndDate, viewMode);

  // Format dates based on view mode
  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid date";
    }

    switch (viewMode) {
      case ViewMode.MINUTE:
        return format(date, "MMM d, yyyy HH:mm");
      case ViewMode.HOUR:
        return format(date, "MMM d, yyyy HH:00");
      case ViewMode.DAY:
        return format(date, "EEE, MMM d, yyyy");
      default:
        return format(date, "MMM d, yyyy");
    }
  };

  // Get action text based on drag type
  const getActionText = () => {
    if (!dragType) return null;

    switch (dragType) {
      case "move":
        return "Moving task...";
      case "resize-left":
        return "Adjusting start date...";
      case "resize-right":
        return "Adjusting end date...";
      default:
        return null;
    }
  };

  const actionText = getActionText();

  // Use custom rendering if provided
  if (renderTooltip) {
    return (
      <div
        className={`rmg-tooltip ${className} rmg-tooltip-visible`}
        style={{
          left: `${position.x}px`,
          top: `${position.y - 40}px`,
        }}
        data-rmg-component="tooltip"
      >
        {renderTooltip({
          task,
          position,
          dragType,
          startDate: displayStartDate,
          endDate: displayEndDate,
          viewMode,
        })}
      </div>
    );
  }

  // Default tooltip rendering
  return (
    <div
      className={`rmg-tooltip ${className} rmg-tooltip-visible`}
      style={{
        left: `${position.x}px`,
        top: `${position.y - 40}px`,
      }}
      data-rmg-component="tooltip"
    >
      {/* Task name */}
      <div className="rmg-tooltip-title" data-rmg-component="tooltip-title">
        {task.name || "Unnamed Task"}
      </div>

      {/* Action indicator */}
      {actionText && (
        <div className="rmg-tooltip-action" data-rmg-component="tooltip-action">
          {actionText}
        </div>
      )}

      {/* Task details */}
      <div className="rmg-tooltip-content" data-rmg-component="tooltip-content">
        <div className="rmg-tooltip-row" data-rmg-component="tooltip-row">
          <div className="rmg-tooltip-label">Start:</div>
          <div className="rmg-tooltip-value">
            {formatDate(displayStartDate)}
          </div>
        </div>

        <div className="rmg-tooltip-row" data-rmg-component="tooltip-row">
          <div className="rmg-tooltip-label">End:</div>
          <div className="rmg-tooltip-value">{formatDate(displayEndDate)}</div>
        </div>

        <div className="rmg-tooltip-row" data-rmg-component="tooltip-row">
          <div className="rmg-tooltip-label">Duration:</div>
          <div className="rmg-tooltip-value">
            {duration.value} {duration.unit}
          </div>
        </div>

        {/* Show progress if enabled */}
        {showProgress && typeof task.percent === "number" && (
          <div className="rmg-tooltip-row" data-rmg-component="tooltip-row">
            <div className="rmg-tooltip-label">Progress:</div>
            <div className="rmg-tooltip-value">{task.percent}%</div>
          </div>
        )}

        {/* Show dependencies if available */}
        {task.dependencies && task.dependencies.length > 0 && (
          <div className="rmg-tooltip-row" data-rmg-component="tooltip-row">
            <div className="rmg-tooltip-label">Dependencies:</div>
            <div className="rmg-tooltip-value">
              {task.dependencies.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tooltip;
