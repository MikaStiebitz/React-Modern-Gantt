import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Task, ViewMode, TaskRowProps } from '@/types';
import { TaskService, CollisionService } from '@/services';
import TaskItem from '@/components/task/TaskItem';
import { Tooltip } from '@/components/ui';

/**
 * TaskRow Component - Displays and manages tasks for a single task group
 */
const TaskRow: React.FC<TaskRowProps> = ({
  taskGroup,
  startDate,
  endDate,
  totalMonths,
  monthWidth,
  editMode = true,
  showProgress = false,
  className = '',
  tooltipClassName = '',
  onTaskUpdate,
  onTaskClick,
  onTaskSelect,
  onAutoScrollChange,
  viewMode = ViewMode.MONTH,
  scrollContainerRef,
  smoothDragging = true,
  movementThreshold = 3,
  animationSpeed = 0.25,
  renderTask,
  renderTooltip,
  getTaskColor,
}) => {
  if (!taskGroup || !taskGroup.id || !Array.isArray(taskGroup.tasks)) {
    return <div className="rmg-task-row rmg-task-row-invalid">Invalid task group data</div>;
  }

  // Ensure valid dates
  const validStartDate = startDate instanceof Date ? startDate : new Date();
  const validEndDate = endDate instanceof Date ? endDate : new Date();

  // Task interaction states
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [dragType, setDragType] = useState<'move' | 'resize-left' | 'resize-right' | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [initialTaskState, setInitialTaskState] = useState<{
    left: number;
    width: number;
    startDate: Date;
    endDate: Date;
  } | null>(null);

  // Animation refs
  const animationFrameRef = useRef<number | null>(null);
  const lastMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetPositionRef = useRef<{ left: number; width: number } | null>(null);
  const currentPositionRef = useRef<{ left: number; width: number } | null>(null);
  const velocityRef = useRef<{ left: number; width: number }>({ left: 0, width: 0 });
  const lastUpdateTimeRef = useRef<number>(0);

  // Auto-scrolling refs
  const autoScrollActive = useRef<boolean>(false);
  const autoScrollTimerRef = useRef<number | null>(null);
  const autoScrollSpeedRef = useRef<number>(0);
  const autoScrollDirectionRef = useRef<'left' | 'right' | null>(null);
  const timelineLimitsRef = useRef<{ minLeft: number; maxLeft: number }>({
    minLeft: 0,
    maxLeft: totalMonths * monthWidth,
  });

  // Refs for task interactions
  const rowRef = useRef<HTMLDivElement>(null);
  const draggingTaskRef = useRef<Task | null>(null);
  const previewTaskRef = useRef<Task | null>(null);
  const taskElementRef = useRef<HTMLElement | null>(null);

  // Instance ID to prevent cross-chart interactions
  const instanceId = useRef(`task-row-${Math.random().toString(36).substring(2, 11)}`);

  // Calculate if we should use smooth dragging - DISABLED for day view
  const shouldUseSmoothDragging = smoothDragging && viewMode !== ViewMode.DAY;

  // Task update helpers
  const updateDraggingTask = (task: Task) => {
    const taskCopy = {
      ...task,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate),
    };
    setDraggingTask(taskCopy);
    draggingTaskRef.current = taskCopy;
  };

  const updatePreviewTask = (task: Task) => {
    const taskCopy = {
      ...task,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate),
    };
    setPreviewTask(taskCopy);
    previewTaskRef.current = taskCopy;
  };

  // Calculate task rows directly in the component using state
  const taskRows = previewTask
    ? CollisionService.getPreviewArrangement(previewTask, taskGroup.tasks, viewMode)
    : CollisionService.detectOverlaps(taskGroup.tasks, viewMode);

  // Calculate row height based on task arrangement
  const rowHeight = Math.max(60, taskRows.length * 40 + 20);

  // Update timeline limits for auto-scrolling
  useEffect(() => {
    timelineLimitsRef.current = {
      minLeft: 0,
      maxLeft: totalMonths * monthWidth,
    };
  }, [totalMonths, monthWidth]);

  // Animation function
  const animateTaskMovement = () => {
    if (!taskElementRef.current || !targetPositionRef.current || !currentPositionRef.current) {
      animationFrameRef.current = null;
      return;
    }

    const now = Date.now();
    const elapsed = now - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = now;

    // Smooth animation coefficient
    const easing = animationSpeed || 0.25;

    // Calculate new position with easing
    const newLeft =
      currentPositionRef.current.left + (targetPositionRef.current.left - currentPositionRef.current.left) * easing;
    const newWidth =
      currentPositionRef.current.width + (targetPositionRef.current.width - currentPositionRef.current.width) * easing;

    // Update velocity for more natural animation
    velocityRef.current.left = (newLeft - currentPositionRef.current.left) / (elapsed || 16);
    velocityRef.current.width = (newWidth - currentPositionRef.current.width) / (elapsed || 16);

    // Update current position
    currentPositionRef.current = { left: newLeft, width: newWidth };

    // Apply to DOM - direct DOM manipulation
    taskElementRef.current.style.left = `${newLeft}px`;
    taskElementRef.current.style.width = `${newWidth}px`;

    // Calculate and update dates based on current position
    if (draggingTaskRef.current) {
      updateDatesFromPosition(newLeft, newWidth);
    }

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(animateTaskMovement);
  };

  // Update dates based on visual position with special Day view handling
  const updateDatesFromPosition = (left: number, width: number) => {
    if (!draggingTaskRef.current) return;

    try {
      // For day view, apply precise date calculation
      if (viewMode === ViewMode.DAY) {
        // Calculate days from start position
        const daysFromStart = Math.round(left / monthWidth);

        // Calculate exact days span
        const daysSpan = Math.max(1, Math.round(width / monthWidth));

        // Apply precise day calculations
        const baseDate = new Date(validStartDate);
        baseDate.setHours(0, 0, 0, 0);

        const newStartDate = new Date(baseDate);
        newStartDate.setDate(baseDate.getDate() + daysFromStart);
        newStartDate.setHours(0, 0, 0, 0);

        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newStartDate.getDate() + daysSpan - 1);
        newEndDate.setHours(23, 59, 59, 999);

        // Ensure dates are within the timeline boundaries
        const startTime = validStartDate.getTime();
        const endTime = validEndDate.getTime();

        const constrainedStartDate = new Date(Math.max(startTime, newStartDate.getTime()));
        const constrainedEndDate = new Date(Math.min(endTime, newEndDate.getTime()));

        // Create updated task with the new dates
        const updatedTask = {
          ...draggingTaskRef.current,
          startDate: constrainedStartDate,
          endDate: constrainedEndDate,
        };

        // Update preview state
        updatePreviewTask(updatedTask);
      } else {
        // Use TaskService for regular calculation
        const { newStartDate, newEndDate } = TaskService.calculateDatesFromPosition(
          left,
          width,
          validStartDate,
          validEndDate,
          totalMonths,
          monthWidth,
          viewMode
        );

        const updatedTask = {
          ...draggingTaskRef.current,
          startDate: newStartDate,
          endDate: newEndDate,
        };

        updatePreviewTask(updatedTask);
      }
    } catch (error) {
      console.error('Error updating dates:', error);
    }
  };

  // Auto-scroll functions
  const checkForAutoScroll = (clientX: number) => {
    if (!scrollContainerRef?.current || !draggingTask) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Define the edge threshold area (in pixels) to trigger auto-scrolling
    const edgeThreshold = 40;

    // Reset auto-scroll direction
    let direction: 'left' | 'right' | null = null;
    let scrollSpeed = 0;

    // Check if mouse is near the left edge
    if (clientX < containerRect.left + edgeThreshold) {
      direction = 'left';
      // Calculate scroll speed based on proximity to edge (closer = faster)
      scrollSpeed = Math.max(1, Math.round((edgeThreshold - (clientX - containerRect.left)) / 10));
    }
    // Check if mouse is near the right edge
    else if (clientX > containerRect.right - edgeThreshold) {
      direction = 'right';
      // Calculate scroll speed based on proximity to edge (closer = faster)
      scrollSpeed = Math.max(1, Math.round((clientX - (containerRect.right - edgeThreshold)) / 10));
    }

    // Update refs with current auto-scroll state
    autoScrollDirectionRef.current = direction;
    autoScrollSpeedRef.current = scrollSpeed;

    // Start or stop auto-scrolling based on direction
    if (direction && !autoScrollActive.current) {
      startAutoScroll();
      if (onAutoScrollChange) onAutoScrollChange(true);
    } else if (!direction && autoScrollActive.current) {
      stopAutoScroll();
      if (onAutoScrollChange) onAutoScrollChange(false);
    }
  };

  // Start auto-scrolling
  const startAutoScroll = () => {
    if (autoScrollActive.current) return;

    autoScrollActive.current = true;

    // Use requestAnimationFrame for smoother scrolling
    const doScroll = () => {
      if (!autoScrollActive.current || !scrollContainerRef?.current || !targetPositionRef.current) return;

      const container = scrollContainerRef.current;
      const direction = autoScrollDirectionRef.current;
      const speed = autoScrollSpeedRef.current;

      // Get current scroll position
      const currentScrollLeft = container.scrollLeft;
      // Get maximum scroll position
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      if (direction === 'left') {
        // Don't scroll past the beginning
        if (currentScrollLeft <= 0) {
          stopAutoScroll();
          return;
        }

        const newScrollLeft = Math.max(0, currentScrollLeft - speed);
        container.scrollLeft = newScrollLeft;

        // Update target position during auto-scroll, but enforce boundaries
        if (targetPositionRef.current) {
          const newLeft = Math.max(timelineLimitsRef.current.minLeft, targetPositionRef.current.left - speed);
          targetPositionRef.current.left = newLeft;
        }
      } else if (direction === 'right') {
        // Don't scroll past the end
        if (currentScrollLeft >= maxScrollLeft) {
          stopAutoScroll();
          return;
        }

        const newScrollLeft = Math.min(maxScrollLeft, currentScrollLeft + speed);
        container.scrollLeft = newScrollLeft;

        // Update target position during auto-scroll, but enforce boundaries
        if (targetPositionRef.current && initialTaskState) {
          const maxLeftPosition = timelineLimitsRef.current.maxLeft - targetPositionRef.current.width;
          const newLeft = Math.min(maxLeftPosition, targetPositionRef.current.left + speed);
          targetPositionRef.current.left = newLeft;
        }
      }

      // Continue scrolling if active
      if (autoScrollActive.current) {
        autoScrollTimerRef.current = requestAnimationFrame(doScroll);
      }
    };

    autoScrollTimerRef.current = requestAnimationFrame(doScroll);
  };

  // Stop auto-scrolling
  const stopAutoScroll = () => {
    autoScrollActive.current = false;
    if (autoScrollTimerRef.current !== null) {
      cancelAnimationFrame(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  };

  // Task interaction handlers
  const handleTaskClick = (event: React.MouseEvent, task: Task) => {
    if (onTaskClick && !draggingTask) {
      onTaskClick(task, taskGroup);
    }

    if (onTaskSelect) {
      onTaskSelect(task, true);
    }
  };

  const handleTaskMouseEnter = (event: React.MouseEvent, task: Task) => {
    if (!draggingTask) {
      setHoveredTask(task);
      updateTooltipPosition(event);
    }
  };

  const handleTaskMouseLeave = () => {
    if (!draggingTask) {
      setHoveredTask(null);
    }
  };

  const updateTooltipPosition = (e: React.MouseEvent | MouseEvent) => {
    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left + 20,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseDown = (event: React.MouseEvent, task: Task, type: 'move' | 'resize-left' | 'resize-right') => {
    if (!editMode) return;

    event.preventDefault();
    event.stopPropagation();

    // Find the task element
    const taskEl = document.querySelector(
      `[data-task-id="${task.id}"][data-instance-id="${instanceId.current}"]`
    ) as HTMLElement;

    if (!taskEl) return;
    taskElementRef.current = taskEl;

    // Store the initial state
    const initialLeft = parseFloat(taskEl.style.left || '0');
    const initialWidth = parseFloat(taskEl.style.width || '0');

    setInitialTaskState({
      left: initialLeft,
      width: initialWidth,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate),
    });

    // Initialize animation refs
    targetPositionRef.current = { left: initialLeft, width: initialWidth };
    currentPositionRef.current = { left: initialLeft, width: initialWidth };
    lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
    lastUpdateTimeRef.current = Date.now();
    velocityRef.current = { left: 0, width: 0 };

    // Update task element data attribute for styling
    taskEl.setAttribute('data-dragging', 'true');

    if (shouldUseSmoothDragging) {
      taskEl.style.transition = 'none'; // We'll handle the animation manually
    } else {
      taskEl.style.transition = 'none';
    }

    // Set up dragging state
    setDraggingTask(task);
    setDragType(type);
    setDragStartX(event.clientX);
    setPreviewTask(task);

    updateDraggingTask(task);
    updatePreviewTask(task);

    // Start animation loop (only for smooth dragging)
    if (animationFrameRef.current === null && shouldUseSmoothDragging) {
      animationFrameRef.current = requestAnimationFrame(animateTaskMovement);
    }

    // Add global event listeners
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    // Store current mouse position for animation
    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };

    // Update tooltip position
    if (e instanceof MouseEvent && hoveredTask && rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left + 20,
        y: e.clientY - rect.top,
      });
    } else if (!(e instanceof MouseEvent)) {
      updateTooltipPosition(e as React.MouseEvent);
    }

    // Check for auto-scrolling when dragging
    if (draggingTask && scrollContainerRef?.current) {
      checkForAutoScroll(e.clientX);
    }

    // Handle task dragging and resizing
    if (draggingTask && dragType && initialTaskState && rowRef.current && targetPositionRef.current) {
      try {
        // Calculate the total movement since drag started
        const totalDeltaX = e.clientX - dragStartX;

        // Get the timeline's total width
        const totalWidth = totalMonths * monthWidth;

        // Calculate new target position based on drag type
        let newLeft = targetPositionRef.current.left;
        let newWidth = targetPositionRef.current.width;

        switch (dragType) {
          case 'move':
            // Move task with bounds checking
            newLeft = Math.max(0, Math.min(totalWidth - initialTaskState.width, initialTaskState.left + totalDeltaX));

            // Special handling for day view (immediate snapping)
            if (viewMode === ViewMode.DAY) {
              newLeft = Math.round(newLeft / monthWidth) * monthWidth;
            }
            break;

          case 'resize-left':
            // Resize from left with minimum width
            const maxLeftDelta = initialTaskState.width - 20;
            const leftDelta = Math.min(maxLeftDelta, totalDeltaX);

            newLeft = Math.max(0, initialTaskState.left + leftDelta);

            // Special handling for day view (immediate snapping)
            if (viewMode === ViewMode.DAY) {
              newLeft = Math.round(newLeft / monthWidth) * monthWidth;
            }

            // Calculate width to maintain right edge position
            const rightEdge = initialTaskState.left + initialTaskState.width;
            newWidth = Math.max(20, rightEdge - newLeft);

            // Special handling for day view (ensure full day widths)
            if (viewMode === ViewMode.DAY) {
              newWidth = Math.round(newWidth / monthWidth) * monthWidth;
              newWidth = Math.max(monthWidth, newWidth); // Minimum one day
            }
            break;

          case 'resize-right':
            // Resize from right with minimum width
            newWidth = Math.max(20, Math.min(totalWidth - initialTaskState.left, initialTaskState.width + totalDeltaX));

            // Special handling for day view (ensure full day widths)
            if (viewMode === ViewMode.DAY) {
              newWidth = Math.round(newWidth / monthWidth) * monthWidth;
              newWidth = Math.max(monthWidth, newWidth); // Minimum one day
            }
            break;
        }

        // Update target position reference
        targetPositionRef.current = { left: newLeft, width: newWidth };

        // Apply position immediately for day view mode
        if (viewMode === ViewMode.DAY && taskElementRef.current) {
          taskElementRef.current.style.left = `${newLeft}px`;
          taskElementRef.current.style.width = `${newWidth}px`;
          updateDatesFromPosition(newLeft, newWidth);
        }
        // Start animation for smooth dragging in other view modes
        else if (shouldUseSmoothDragging) {
          if (animationFrameRef.current === null) {
            lastUpdateTimeRef.current = Date.now();
            animationFrameRef.current = requestAnimationFrame(animateTaskMovement);
          }
        }
        // Direct update for non-smooth non-day view modes
        else if (taskElementRef.current) {
          taskElementRef.current.style.left = `${newLeft}px`;
          taskElementRef.current.style.width = `${newWidth}px`;
          updateDatesFromPosition(newLeft, newWidth);
        }
      } catch (error) {
        console.error('Error in handleMouseMove:', error);
      }
    }
  };

  // Finalize task positioning on mouse up with special day view handling
  const finalizeTaskPosition = () => {
    if (!taskElementRef.current || !targetPositionRef.current || !draggingTaskRef.current) return;

    // Get final position
    let finalLeft = targetPositionRef.current.left;
    let finalWidth = targetPositionRef.current.width;

    // Apply snapping for final position in day mode
    if (viewMode === ViewMode.DAY) {
      // Snap to day grid
      finalLeft = Math.round(finalLeft / monthWidth) * monthWidth;
      finalWidth = Math.round(finalWidth / monthWidth) * monthWidth;

      // Ensure minimum width
      finalWidth = Math.max(monthWidth, finalWidth);

      // Apply final position to element with transition
      taskElementRef.current.style.transition = 'transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out';
      taskElementRef.current.style.left = `${finalLeft}px`;
      taskElementRef.current.style.width = `${finalWidth}px`;

      // Update dates from the snapped position
      updateDatesFromPosition(finalLeft, finalWidth);
    }
    // Apply snapping for other modes if desired
    else if (!shouldUseSmoothDragging) {
      taskElementRef.current.style.transition = 'transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out';
      taskElementRef.current.style.left = `${finalLeft}px`;
      taskElementRef.current.style.width = `${finalWidth}px`;
    }

    // Calculate final dates
    let finalTask = previewTaskRef.current;
    if (!finalTask) return;

    // Verify final task is within timeline bounds
    const timelineStartTime = validStartDate.getTime();
    const timelineEndTime = validEndDate.getTime();

    // Ensure task dates are within bounds
    if (finalTask.startDate.getTime() < timelineStartTime) {
      finalTask = {
        ...finalTask,
        startDate: new Date(timelineStartTime),
      };
    }

    if (finalTask.endDate.getTime() > timelineEndTime) {
      finalTask = {
        ...finalTask,
        endDate: new Date(timelineEndTime),
      };
    }

    // Call update handler with the final task
    if (onTaskUpdate && finalTask) {
      try {
        onTaskUpdate(taskGroup.id, finalTask);
      } catch (error) {
        console.error('Error in onTaskUpdate:', error);
      }
    }
  };

  const handleMouseUp = () => {
    try {
      // Cancel any ongoing animation
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Finalize task position with snapping
      finalizeTaskPosition();

      // Clean up animation state
      if (taskElementRef.current) {
        // Reset the dragging state
        taskElementRef.current.setAttribute('data-dragging', 'false');

        // Reset transitions after a short delay to allow final animation to complete
        setTimeout(() => {
          if (taskElementRef.current) {
            taskElementRef.current.style.transition = '';
          }
        }, 200);
      }
    } catch (error) {
      console.error('Error in handleMouseUp:', error);
    } finally {
      // Stop auto-scrolling
      stopAutoScroll();
      if (onAutoScrollChange) onAutoScrollChange(false);

      // Reset all drag states
      setDraggingTask(null);
      setDragType(null);
      setPreviewTask(null);
      setInitialTaskState(null);
      draggingTaskRef.current = null;
      previewTaskRef.current = null;
      taskElementRef.current = null;
      targetPositionRef.current = null;
      currentPositionRef.current = null;

      // Remove global event listeners
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
    }
  };

  // Handle progress update
  const handleProgressUpdate = (task: Task, newPercent: number) => {
    if (onTaskUpdate && taskGroup.id) {
      try {
        // Create updated task with new progress percentage
        const updatedTask = {
          ...task,
          percent: newPercent,
        };

        // Call the onTaskUpdate handler with the updated task
        onTaskUpdate(taskGroup.id, updatedTask);
      } catch (error) {
        console.error('Error updating task progress:', error);
      }
    }
  };

  // Clean up event listeners and animations on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
      stopAutoScroll();

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  // Handle empty task groups
  if (!taskGroup.tasks || taskGroup.tasks.length === 0) {
    return <div className="rmg-task-row rmg-task-row-empty">No tasks available</div>;
  }

  return (
    <div
      className={`rmg-task-row ${className}`}
      style={{
        height: `${rowHeight}px`,
        minWidth: `${totalMonths * monthWidth}px`,
      }}
      onMouseMove={e => handleMouseMove(e)}
      onMouseLeave={() => setHoveredTask(null)}
      ref={rowRef}
      data-testid={`task-row-${taskGroup.id}`}
      data-instance-id={instanceId.current}
      data-rmg-component="task-row"
      data-group-id={taskGroup.id}>
      {/* Render tasks by row to prevent overlaps */}
      {taskRows.map((rowTasks, rowIndex) => (
        <React.Fragment key={`task-row-${rowIndex}`}>
          {rowTasks.map(task => {
            try {
              if (!task || !task.id || !(task.startDate instanceof Date) || !(task.endDate instanceof Date)) {
                console.warn('Invalid task data:', task);
                return null;
              }

              // Calculate task position
              const { leftPx, widthPx } = TaskService.calculateTaskPixelPosition(
                task,
                validStartDate,
                validEndDate,
                totalMonths,
                monthWidth,
                viewMode
              );

              const isHovered = hoveredTask?.id === task.id;
              const isDragging = draggingTask?.id === task.id;
              const topPx = rowIndex * 40 + 10;

              return (
                <TaskItem
                  key={`task-${task.id}`}
                  task={task}
                  leftPx={leftPx}
                  widthPx={widthPx}
                  topPx={topPx}
                  isHovered={isHovered}
                  isDragging={isDragging}
                  editMode={editMode}
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
            } catch (error) {
              console.error('Error rendering task:', error);
              return null;
            }
          })}
        </React.Fragment>
      ))}

      {/* Task tooltip */}
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
