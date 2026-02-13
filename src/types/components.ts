import React from 'react';
import { Task, TaskGroup, GanttStyles } from './core';
import { ViewMode } from './enums';

export interface TaskListRenderProps {
  tasks: TaskGroup[];
  headerLabel?: string;
  onGroupClick?: (group: TaskGroup) => void;
  viewMode: ViewMode;
}

export interface TaskRenderProps {
  task: Task;
  leftPx: number;
  widthPx: number;
  topPx: number;
  isHovered: boolean;
  isDragging: boolean;
  editMode: boolean;
  showProgress?: boolean;
}

export interface TooltipRenderProps {
  task: Task;
  position: { x: number; y: number };
  dragType: 'move' | 'resize-left' | 'resize-right' | null;
  startDate: Date;
  endDate: Date;
  viewMode: ViewMode;
}

export interface ViewModeSelectorRenderProps {
  activeMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  darkMode: boolean;
  availableModes?: ViewMode[];
}

export interface HeaderRenderProps {
  title: string;
  darkMode: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showViewModeSelector: boolean;
}

export interface TimelineHeaderRenderProps {
  timeUnits: Date[];
  currentUnitIndex: number;
  viewMode: ViewMode;
  locale: string;
  unitWidth: number;
}

export interface TaskColorProps {
  task: Task;
  isHovered: boolean;
  isDragging: boolean;
}

// Component props
export interface GanttChartProps {
  tasks: TaskGroup[];
  startDate?: Date;
  endDate?: Date;
  title?: string;
  currentDate?: Date;
  showCurrentDateMarker?: boolean;
  todayLabel?: string;
  editMode?: boolean; // Global master switch for all editing (default: true)
  allowProgressEdit?: boolean; // Allow progress bar editing (default: true, requires editMode=true)
  allowTaskResize?: boolean; // Allow task resizing (default: true, requires editMode=true)
  allowTaskMove?: boolean; // Allow task movement (default: true, requires editMode=true)
  headerLabel?: string;
  showProgress?: boolean;
  darkMode?: boolean;
  locale?: string;
  styles?: GanttStyles;
  viewMode?: ViewMode;

  // Updated ViewMode configuration
  viewModes?: ViewMode[] | false; // Array of allowed modes, or false to hide selector

  smoothDragging?: boolean;
  movementThreshold?: number;
  animationSpeed?: number;
  minuteStep?: number; // For minute view granularity (e.g., 5, 10, 15 minutes)

  // NEW: Infinite scroll feature
  infiniteScroll?: boolean; // Enable automatic timeline extension
  onTimelineExtend?: (direction: 'left' | 'right', newStartDate: Date, newEndDate: Date) => void;

  // NEW: Focus mode - automatically scroll to show "now" when switching view modes
  focusMode?: boolean; // Default: true

  // Custom rendering functions
  renderTaskList?: (props: TaskListRenderProps) => React.ReactNode;
  renderTask?: (props: TaskRenderProps) => React.ReactNode;
  renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
  renderViewModeSelector?: (props: ViewModeSelectorRenderProps) => React.ReactNode;
  renderHeader?: (props: HeaderRenderProps) => React.ReactNode;
  renderTimelineHeader?: (props: TimelineHeaderRenderProps) => React.ReactNode;
  getTaskColor?: (props: TaskColorProps) => {
    backgroundColor: string;
    borderColor?: string;
    textColor?: string;
  };

  // Event handlers
  onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
  onTaskClick?: (task: Task, group: TaskGroup) => void;
  onTaskSelect?: (task: Task, isSelected: boolean) => void;
  onTaskDoubleClick?: (task: Task) => void;
  onGroupClick?: (group: TaskGroup) => void;
  onViewModeChange?: (viewMode: ViewMode) => void;

  // Visual customization
  fontSize?: string;
  rowHeight?: number;
  timeStep?: number;
  unitWidth?: number;
}
export interface TaskRowProps {
  taskGroup: TaskGroup;
  startDate: Date;
  endDate: Date;
  totalMonths: number;
  monthWidth: number;
  editMode?: boolean; // Global master switch
  allowProgressEdit?: boolean; // Allow progress editing
  allowTaskResize?: boolean; // Allow task resizing
  allowTaskMove?: boolean; // Allow task movement
  showProgress?: boolean;
  className?: string;
  tooltipClassName?: string;
  smoothDragging?: boolean;
  movementThreshold?: number;
  animationSpeed?: number;
  onTaskUpdate?: (groupId: string, updatedTask: Task) => void;
  onTaskClick?: (task: Task, group: TaskGroup) => void;
  onTaskSelect?: (task: Task, isSelected: boolean) => void;
  onAutoScrollChange?: (isScrolling: boolean) => void;
  viewMode?: ViewMode;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;

  // NEW: Infinite scroll support
  infiniteScroll?: boolean;
  onTimelineExtend?: (direction: 'left' | 'right') => void;

  // Custom render functions
  renderTask?: (props: TaskRenderProps) => React.ReactNode;
  renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
  getTaskColor?: (props: TaskColorProps) => {
    backgroundColor: string;
    borderColor?: string;
    textColor?: string;
  };
}

export interface TaskListProps {
  tasks: TaskGroup[];
  headerLabel?: string;
  showIcon?: boolean;
  showTaskCount?: boolean;
  showDescription?: boolean;
  rowHeight?: number;
  className?: string;
  onGroupClick?: (group: TaskGroup) => void;
  viewMode?: ViewMode;
}

export interface TimelineProps {
  months: Date[];
  currentMonthIndex: number;
  locale?: string;
  className?: string;
  viewMode?: ViewMode;
  unitWidth?: number;
}

export interface TaskItemProps {
  task: Task;
  leftPx: number;
  widthPx: number;
  topPx: number;
  isHovered: boolean;
  isDragging: boolean;
  editMode: boolean;
  allowProgressEdit?: boolean; // Allow progress editing
  allowTaskResize?: boolean; // Allow task resizing
  allowTaskMove?: boolean; // Allow task movement
  showProgress?: boolean;
  instanceId: string;
  className?: string;
  getTaskColor?: (props: TaskColorProps) => {
    backgroundColor: string;
    borderColor?: string;
    textColor?: string;
  };
  renderTask?: (props: TaskRenderProps) => React.ReactNode;
  onMouseDown: (event: React.MouseEvent, task: Task, type: 'move' | 'resize-left' | 'resize-right') => void;
  onMouseEnter: (event: React.MouseEvent, task: Task) => void;
  onMouseLeave: () => void;
  onClick: (event: React.MouseEvent, task: Task) => void;
  onProgressUpdate?: (task: Task, newPercent: number) => void;
}

export interface TooltipProps {
  task: Task;
  position: { x: number; y: number };
  dragType: 'move' | 'resize-left' | 'resize-right' | null;
  taskId?: string;
  startDate: Date;
  endDate: Date;
  totalMonths: number;
  monthWidth: number;
  showProgress?: boolean;
  instanceId: string;
  className?: string;
  viewMode?: ViewMode;
  renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
}

export interface TodayMarkerProps {
  currentMonthIndex: number;
  height: number;
  label?: string;
  dayOfMonth?: number;
  className?: string;
  markerClass?: string;
  viewMode?: ViewMode;
  unitWidth?: number;
}

// Interaction states for custom hooks
export interface TaskInteraction {
  draggingTask: Task | null;
  dragType: 'move' | 'resize-left' | 'resize-right' | null;
  dragStartX: number;
  hoveredTask: Task | null;
  tooltipPosition: { x: number; y: number };
  previewTask: Task | null;
}
