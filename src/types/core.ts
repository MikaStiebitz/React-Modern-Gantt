export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  percent?: number;
  dependencies?: string[];
  [key: string]: any;
}

export interface TaskGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  tasks: Task[];
  [key: string]: any;
}

/** A single dependency arrow from one task to another, identified by task ID. */
export interface DependencyLink {
  from: string;
  to: string;
}

export interface GanttStyles {
  container?: string;
  title?: string;
  header?: string;
  taskList?: string;
  timeline?: string;
  todayMarker?: string;
  taskRow?: string;
  taskItem?: string;
  tooltip?: string;
}
