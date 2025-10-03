import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TaskItemProps } from '@/types';

/**
 * TaskItem Component - Renders an individual task bar in the Gantt chart
 */
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  leftPx,
  widthPx,
  topPx,
  isHovered,
  isDragging,
  editMode,
  showProgress = false,
  instanceId,
  renderTask,
  getTaskColor,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onProgressUpdate,
}) => {
  // Show handles only when hovered or dragging and in edit mode
  const showHandles = (isHovered || isDragging) && editMode;
  const taskRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [progressPercent, setProgressPercent] = useState(task.percent || 0);
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);

  if (!task || !task.id) {
    return null;
  }

  // Get task colors - either from custom function or default
  let backgroundColor = task.color || 'var(--rmg-task-color)';
  let borderColor = '';
  let textColor = 'var(--rmg-task-text-color)';

  if (getTaskColor) {
    const colors = getTaskColor({ task, isHovered, isDragging });
    backgroundColor = colors.backgroundColor;
    borderColor = colors.borderColor || '';
    textColor = colors.textColor || textColor;
  }

  // Handle resize interactions
  const handleResizeLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown(e, task, 'resize-left');
  };

  const handleResizeRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown(e, task, 'resize-right');
  };

  // Progress bubble drag handlers with improved smoothness
  const handleProgressMouseDown = (e: React.MouseEvent) => {
    if (!editMode || !showProgress) return;

    e.stopPropagation();
    e.preventDefault();

    setIsDraggingProgress(true);
    setShowProgressTooltip(true);

    // Apply a smooth transition during drag for better visual feedback
    if (progressBarRef.current) {
      progressBarRef.current.style.transition = 'width 0.05s ease-out';
    }

    // Add global event listeners
    document.addEventListener('mousemove', handleProgressMouseMove);
    document.addEventListener('mouseup', handleProgressMouseUp);
  };

  const handleProgressMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingProgress || !taskRef.current) return;

      // Get progress bar bounds
      const taskRect = taskRef.current.getBoundingClientRect();

      // Calculate new progress percentage based on mouse position
      const barWidth = taskRect.width - 2; // Account for 1px padding on each side
      const clickX = Math.max(0, Math.min(barWidth, e.clientX - taskRect.left));
      const newPercent = Math.round((clickX / barWidth) * 100);

      // Update progress value with constraints
      setProgressPercent(Math.max(0, Math.min(100, newPercent)));
    },
    [isDraggingProgress]
  );

  const handleProgressMouseUp = useCallback(() => {
    if (!isDraggingProgress) return;

    setIsDraggingProgress(false);
    setShowProgressTooltip(false);

    // Remove global event listeners
    document.removeEventListener('mousemove', handleProgressMouseMove);
    document.removeEventListener('mouseup', handleProgressMouseUp);

    // Reset transition after update for normal behavior
    if (progressBarRef.current) {
      progressBarRef.current.style.transition = '';
    }

    // Call update handler with the updated progress
    if (onProgressUpdate && progressPercent !== task.percent) {
      onProgressUpdate(task, progressPercent);
    }
  }, [isDraggingProgress, onProgressUpdate, progressPercent, task]);

  // Update progress state when task changes
  useEffect(() => {
    setProgressPercent(task.percent || 0);
  }, [task.percent]);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleProgressMouseMove);
      document.removeEventListener('mouseup', handleProgressMouseUp);
    };
  }, [handleProgressMouseMove, handleProgressMouseUp]);

  // Use custom render function if provided
  if (renderTask) {
    const customTaskContent = renderTask({
      task,
      leftPx,
      widthPx,
      topPx,
      isHovered,
      isDragging,
      editMode,
      showProgress,
    });

    return (
      <div
        ref={taskRef}
        className="rmg-task-item-custom"
        style={{
          position: 'absolute',
          left: `${Math.max(0, leftPx)}px`,
          width: `${Math.max(20, widthPx)}px`,
          top: `${topPx}px`,
        }}
        onClick={e => onClick(e, task)}
        onMouseDown={e => onMouseDown(e, task, 'move')}
        onMouseEnter={e => onMouseEnter(e, task)}
        onMouseLeave={onMouseLeave}
        data-testid={`task-${task.id}`}
        data-task-id={task.id}
        data-instance-id={instanceId}
        data-dragging={isDragging ? 'true' : 'false'}
        data-rmg-component="task">
        {customTaskContent}
      </div>
    );
  }

  // Inline styles based on received task colors
  const taskStyles: React.CSSProperties = {
    left: `${Math.max(0, leftPx)}px`,
    width: `${Math.max(20, widthPx)}px`,
    top: `${topPx}px`,
    willChange: isDragging ? 'transform, left, width' : 'auto',
    backgroundColor:
      backgroundColor.startsWith('var(') || backgroundColor.startsWith('#') ? backgroundColor : `var(--rmg-task-color)`,
    color: textColor.startsWith('var(') || textColor.startsWith('#') ? textColor : `var(--rmg-task-text-color)`,
  };

  if (borderColor) {
    taskStyles.borderColor = borderColor;
    taskStyles.borderWidth = '1px';
    taskStyles.borderStyle = 'solid';
  }

  return (
    <div
      ref={taskRef}
      className={`rmg-task-item ${isDragging ? 'rmg-task-item-dragging' : ''}`}
      style={taskStyles}
      onClick={e => onClick(e, task)}
      onMouseDown={e => onMouseDown(e, task, 'move')}
      onMouseEnter={e => onMouseEnter(e, task)}
      onMouseLeave={onMouseLeave}
      data-testid={`task-${task.id}`}
      data-task-id={task.id}
      data-instance-id={instanceId}
      data-dragging={isDragging ? 'true' : 'false'}
      data-rmg-component="task">
      {/* Left resize handle */}
      {showHandles && (
        <div
          className="rmg-resize-handle rmg-resize-handle-left"
          onMouseDown={handleResizeLeft}
          data-rmg-component="resize-handle"
          data-rmg-handle="left"
        />
      )}

      {/* Task name */}
      <div className="rmg-task-item-name">{task.name || 'Unnamed Task'}</div>

      {/* Progress bar with interactive bubble */}
      {showProgress && typeof progressPercent === 'number' && (
        <div
          ref={progressBarRef}
          className="rmg-progress-bar"
          onClick={e => {
            if (editMode && showProgress && onProgressUpdate) {
              e.stopPropagation();
              const barWidth = e.currentTarget.clientWidth;
              const clickX = e.nativeEvent.offsetX;
              const newPercent = Math.round((clickX / barWidth) * 100);
              setProgressPercent(newPercent);
              onProgressUpdate(task, newPercent);
            }
          }}
          data-rmg-component="progress-bar">
          <div
            className="rmg-progress-fill"
            style={{
              width: `${progressPercent}%`,
              transition: isDraggingProgress ? 'none' : 'width 0.3s ease-out',
            }}
            data-rmg-component="progress-fill">
            {/* Progress bubble handle */}
            {editMode && (isHovered || isDraggingProgress) && (
              <>
                <div
                  className={`rmg-progress-handle ${isDraggingProgress ? 'rmg-progress-handle-dragging' : ''}`}
                  onMouseDown={handleProgressMouseDown}
                  data-rmg-component="progress-handle"
                />
                {/* Progress percentage tooltip */}
                {showProgressTooltip && isDraggingProgress && (
                  <div className="rmg-progress-tooltip" data-rmg-component="progress-tooltip">
                    {progressPercent}%
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Right resize handle */}
      {showHandles && (
        <div
          className="rmg-resize-handle rmg-resize-handle-right"
          onMouseDown={handleResizeRight}
          data-rmg-component="resize-handle"
          data-rmg-handle="right"
        />
      )}
    </div>
  );
};

export default TaskItem;
