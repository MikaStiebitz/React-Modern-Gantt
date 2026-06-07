import React, { useState, useRef, useEffect, useMemo } from "react";
import { Task, ViewMode, TaskRowProps } from "@/types";
import { CollisionService } from "@/services";
import { TimeScale, snapStart, snapEnd, shiftByUnits, unitMs } from "@/core";
import TaskItem from "@/components/task/TaskItem";
import { Tooltip } from "@/components/ui";

type DragType = "move" | "resize-left" | "resize-right";

interface DragState {
  task: Task;
  type: DragType;
  // Pixel offset (grid space) between the cursor and the grabbed edge at the
  // moment the drag started. Captured once; combined with the *current* grid
  // position each frame so timeline extension / scrolling can never desync it.
  grabOffset: number;
  origStart: Date;
  origEnd: Date;
}

/**
 * TaskRow — displays and manages the tasks of a single group.
 *
 * All dragging happens in date-space: pointer movement is converted to a date
 * via the shared {@link TimeScale}, snapped to the view's unit grid, and stored
 * as preview dates. Rendering always derives pixels from dates, so the bar, the
 * header and the stored data stay perfectly consistent — and extending the
 * timeline mid-drag simply re-derives positions from the (unchanged) dates.
 */
const TaskRow: React.FC<TaskRowProps> = ({
  taskGroup,
  startDate,
  endDate,
  totalMonths,
  monthWidth,
  editMode = true,
  allowProgressEdit = true,
  allowTaskResize = true,
  allowTaskMove = true,
  showProgress = false,
  className = "",
  tooltipClassName = "",
  onTaskUpdate,
  onTaskClick,
  onTaskSelect,
  onAutoScrollChange,
  viewMode = ViewMode.MONTH,
  minuteStep = 5,
  scrollContainerRef,
  infiniteScroll = false,
  onTimelineExtend,
  renderTask,
  renderTooltip,
  getTaskColor,
}) => {
  const isValidGroup =
    !!taskGroup && !!taskGroup.id && Array.isArray(taskGroup.tasks);
  const groupTasks: Task[] = isValidGroup ? taskGroup.tasks : [];

  const validStartDate = startDate instanceof Date ? startDate : new Date();
  const validEndDate = endDate instanceof Date ? endDate : new Date();

  // Shared coordinate system for this row. Rebuilt only when the timeline
  // bounds, view mode or unit width change.
  const scale = useMemo(
    () =>
      new TimeScale(
        viewMode,
        validStartDate,
        validEndDate,
        monthWidth,
        minuteStep,
      ),
    [
      viewMode,
      validStartDate.getTime(),
      validEndDate.getTime(),
      monthWidth,
      minuteStep,
    ],
  );

  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [dragType, setDragType] = useState<DragType | null>(null);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const rowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const previewRef = useRef<Task | null>(null);
  const lastClientXRef = useRef(0);
  // Always points at the latest scale so an in-flight drag (whose document
  // listeners are closures from an earlier render) re-derives positions from
  // the *current* timeline — essential when infinite scroll extends mid-drag.
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  // Auto-scroll bookkeeping
  const autoScrollRaf = useRef<number | null>(null);
  const autoScrollDir = useRef<"left" | "right" | null>(null);
  const autoScrollSpeed = useRef(0);

  const instanceId = useRef(
    `task-row-${Math.random().toString(36).substring(2, 11)}`,
  );

  // Collision layout (one row of bars per non-overlapping lane). During a drag
  // the preview task replaces its original so lanes reflow live.
  const taskRows = useMemo(
    () =>
      previewTask
        ? CollisionService.getPreviewArrangement(
            previewTask,
            groupTasks,
            viewMode,
          )
        : CollisionService.detectOverlaps(groupTasks, viewMode),
    [previewTask, groupTasks, viewMode],
  );

  const rowHeight = Math.max(60, taskRows.length * 40 + 20);

  // ── Drag math ──────────────────────────────────────────────────────────────

  /** Cursor x in grid-content coordinates (0 = timeline start). */
  const gridX = (clientX: number): number => {
    if (!rowRef.current) return 0;
    return clientX - rowRef.current.getBoundingClientRect().left;
  };

  const setPreview = (task: Task) => {
    const copy = {
      ...task,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate),
    };
    previewRef.current = copy;
    setPreviewTask(copy);
  };

  /** Recompute the preview task from the current cursor + scale. */
  const recomputePreview = () => {
    const drag = dragRef.current;
    if (!drag) return;

    const scale = scaleRef.current;
    const desiredLeftPx = gridX(lastClientXRef.current) - drag.grabOffset;
    const step = unitMs(viewMode, minuteStep);

    if (drag.type === "move") {
      // Shift both edges by a whole number of units → duration is preserved.
      const rawStart = scale.xToDate(desiredLeftPx);
      const deltaUnits = Math.round(
        (rawStart.getTime() - drag.origStart.getTime()) / step,
      );
      const newStart = shiftByUnits(
        drag.origStart,
        viewMode,
        deltaUnits,
        minuteStep,
      );
      const newEnd = shiftByUnits(
        drag.origEnd,
        viewMode,
        deltaUnits,
        minuteStep,
      );
      setPreview({ ...drag.task, startDate: newStart, endDate: newEnd });
    } else if (drag.type === "resize-left") {
      let newStart = snapStart(
        scale.xToDate(desiredLeftPx),
        viewMode,
        minuteStep,
      );
      const maxStart = snapStart(drag.origEnd, viewMode, minuteStep);
      if (newStart.getTime() > maxStart.getTime()) newStart = maxStart;
      setPreview({ ...drag.task, startDate: newStart, endDate: drag.origEnd });
    } else {
      const desiredRightPx = gridX(lastClientXRef.current) - drag.grabOffset;
      // Right edge is exclusive: nudge inward so a boundary belongs to the
      // column on its left.
      let newEnd = snapEnd(
        scale.xToDate(desiredRightPx - 0.001),
        viewMode,
        minuteStep,
      );
      const minEnd = snapEnd(drag.origStart, viewMode, minuteStep);
      if (newEnd.getTime() < minEnd.getTime()) newEnd = minEnd;
      setPreview({ ...drag.task, startDate: drag.origStart, endDate: newEnd });
    }
  };

  const handleMouseDown = (
    event: React.MouseEvent,
    task: Task,
    type: DragType,
  ) => {
    if (!editMode) return;
    if (type === "move" && !allowTaskMove) return;
    if ((type === "resize-left" || type === "resize-right") && !allowTaskResize)
      return;

    event.preventDefault();
    event.stopPropagation();

    const origStart = new Date(task.startDate);
    const origEnd = new Date(task.endDate);
    const cursorGridX = gridX(event.clientX);
    const edgePx =
      type === "resize-right"
        ? scale.dateToX(origEnd)
        : scale.dateToX(origStart);

    dragRef.current = {
      task,
      type,
      grabOffset: cursorGridX - edgePx,
      origStart,
      origEnd,
    };
    lastClientXRef.current = event.clientX;

    setDraggingTask(task);
    setDragType(type);
    setPreview(task);

    document.addEventListener("mousemove", handleDocMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleDocMouseMove = (e: MouseEvent) => {
    if (!dragRef.current) return;
    lastClientXRef.current = e.clientX;

    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left + 20,
        y: e.clientY - rect.top,
      });
    }

    recomputePreview();
    checkAutoScroll(e.clientX);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleDocMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    stopAutoScroll();

    const finalTask = previewRef.current;
    const groupId = taskGroup.id;

    // Reset drag state first so the row re-renders from the real task data.
    dragRef.current = null;
    previewRef.current = null;
    setDraggingTask(null);
    setDragType(null);
    setPreviewTask(null);

    if (!finalTask || !onTaskUpdate) return;

    let start = new Date(finalTask.startDate);
    let end = new Date(finalTask.endDate);

    // Keep the result inside the timeline unless the host opts into growth.
    if (!infiniteScroll) {
      if (start.getTime() < validStartDate.getTime())
        start = new Date(validStartDate);
      if (end.getTime() > validEndDate.getTime()) end = new Date(validEndDate);
    }

    try {
      onTaskUpdate(groupId, { ...finalTask, startDate: start, endDate: end });
    } catch (error) {
      console.error("Error in onTaskUpdate:", error);
    }
  };

  // ── Auto-scroll while dragging near an edge ─────────────────────────────────

  const checkAutoScroll = (clientX: number) => {
    const container = scrollContainerRef?.current;
    if (!container || !dragRef.current) return;

    const rect = container.getBoundingClientRect();
    const edge = 40;
    let dir: "left" | "right" | null = null;
    let speed = 0;

    if (clientX < rect.left + edge) {
      dir = "left";
      speed = Math.max(1, Math.round((rect.left + edge - clientX) / 10));
    } else if (clientX > rect.right - edge) {
      dir = "right";
      speed = Math.max(1, Math.round((clientX - (rect.right - edge)) / 10));
    }

    autoScrollDir.current = dir;
    autoScrollSpeed.current = speed;

    if (dir && autoScrollRaf.current === null) {
      onAutoScrollChange?.(true);
      autoScrollRaf.current = requestAnimationFrame(autoScrollStep);
    } else if (!dir) {
      stopAutoScroll();
    }
  };

  const autoScrollStep = () => {
    const container = scrollContainerRef?.current;
    const dir = autoScrollDir.current;
    if (!container || !dir || !dragRef.current) {
      autoScrollRaf.current = null;
      return;
    }

    const maxScroll = container.scrollWidth - container.clientWidth;
    const amount = autoScrollSpeed.current * 3;

    if (dir === "left") {
      if (container.scrollLeft <= 0) {
        if (infiniteScroll && onTimelineExtend) onTimelineExtend("left");
        stopAutoScroll();
        return;
      }
      container.scrollLeft = Math.max(0, container.scrollLeft - amount);
    } else {
      if (container.scrollLeft >= maxScroll) {
        if (infiniteScroll && onTimelineExtend) onTimelineExtend("right");
        stopAutoScroll();
        return;
      }
      container.scrollLeft = Math.min(maxScroll, container.scrollLeft + amount);
    }

    recomputePreview();
    autoScrollRaf.current = requestAnimationFrame(autoScrollStep);
  };

  const stopAutoScroll = () => {
    if (autoScrollRaf.current !== null) {
      cancelAnimationFrame(autoScrollRaf.current);
      autoScrollRaf.current = null;
    }
    autoScrollDir.current = null;
    onAutoScrollChange?.(false);
  };

  // ── Hover / click / progress ────────────────────────────────────────────────

  const handleRowMouseMove = (e: React.MouseEvent) => {
    if (dragRef.current || !hoveredTask || !rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left + 20,
      y: e.clientY - rect.top,
    });
  };

  const handleTaskClick = (_event: React.MouseEvent, task: Task) => {
    if (dragRef.current) return;
    onTaskClick?.(task, taskGroup);
    onTaskSelect?.(task, true);
  };

  const handleTaskMouseEnter = (event: React.MouseEvent, task: Task) => {
    if (dragRef.current) return;
    setHoveredTask(task);
    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - rect.left + 20,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleTaskMouseLeave = () => {
    if (!dragRef.current) setHoveredTask(null);
  };

  const handleProgressUpdate = (task: Task, newPercent: number) => {
    if (onTaskUpdate && taskGroup.id) {
      try {
        onTaskUpdate(taskGroup.id, { ...task, percent: newPercent });
      } catch (error) {
        console.error("Error updating task progress:", error);
      }
    }
  };

  // Clean up listeners on unmount.
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDocMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (autoScrollRaf.current !== null)
        cancelAnimationFrame(autoScrollRaf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isValidGroup) {
    return (
      <div className="rmg-task-row rmg-task-row-invalid">
        Invalid task group data
      </div>
    );
  }

  if (groupTasks.length === 0) {
    return (
      <div className="rmg-task-row rmg-task-row-empty">No tasks available</div>
    );
  }

  return (
    <div
      className={`rmg-task-row ${className}`}
      style={{
        height: `${rowHeight}px`,
        minWidth: `${scale.totalWidth}px`,
      }}
      onMouseMove={handleRowMouseMove}
      onMouseLeave={() => setHoveredTask(null)}
      ref={rowRef}
      data-testid={`task-row-${taskGroup.id}`}
      data-instance-id={instanceId.current}
      data-rmg-component="task-row"
      data-group-id={taskGroup.id}
    >
      {taskRows.map((rowTasks, rowIndex) => (
        <React.Fragment key={`lane-${rowIndex}`}>
          {rowTasks.map((task) => {
            if (
              !task ||
              !task.id ||
              !(task.startDate instanceof Date) ||
              !(task.endDate instanceof Date)
            ) {
              return null;
            }

            const { leftPx, widthPx } = scale.positionTask(
              task.startDate,
              task.endDate,
            );
            const isDragging = draggingTask?.id === task.id;

            return (
              <TaskItem
                key={`task-${task.id}`}
                task={task}
                leftPx={leftPx}
                widthPx={widthPx}
                topPx={rowIndex * 40 + 10}
                isHovered={hoveredTask?.id === task.id}
                isDragging={isDragging}
                editMode={editMode}
                allowProgressEdit={allowProgressEdit}
                allowTaskResize={allowTaskResize}
                allowTaskMove={allowTaskMove}
                showProgress={showProgress}
                instanceId={instanceId.current}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleTaskMouseEnter}
                onMouseLeave={handleTaskMouseLeave}
                onClick={handleTaskClick}
                renderTask={renderTask}
                getTaskColor={getTaskColor}
                onProgressUpdate={handleProgressUpdate}
              />
            );
          })}
        </React.Fragment>
      ))}

      {(hoveredTask || draggingTask) && (
        <Tooltip
          task={previewTask || draggingTask || hoveredTask!}
          position={tooltipPosition}
          dragType={dragType}
          taskId={draggingTask?.id}
          startDate={validStartDate}
          endDate={validEndDate}
          totalMonths={totalMonths}
          monthWidth={monthWidth}
          showProgress={showProgress}
          instanceId={instanceId.current}
          className={tooltipClassName}
          viewMode={viewMode}
          renderTooltip={renderTooltip}
        />
      )}
    </div>
  );
};

export default TaskRow;
