import { TaskGroup } from "@/types";

/**
 * Finds the earliest start date from all tasks
 */
export function findEarliestDate(taskGroups: TaskGroup[]): Date {
  if (!Array.isArray(taskGroups) || taskGroups.length === 0) {
    return new Date();
  }

  let earliestDate = new Date();
  let foundAnyValidDate = false;

  taskGroups.forEach((group) => {
    if (!group || !Array.isArray(group.tasks)) return;

    group.tasks.forEach((task) => {
      if (task && task.startDate instanceof Date) {
        if (!foundAnyValidDate) {
          earliestDate = new Date(task.startDate);
          foundAnyValidDate = true;
        } else if (task.startDate < earliestDate) {
          earliestDate = new Date(task.startDate);
        }
      }
    });
  });

  if (!foundAnyValidDate) {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() - 1, 1);
  }

  return new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
}

/**
 * Finds the latest end date from all tasks
 */
export function findLatestDate(taskGroups: TaskGroup[]): Date {
  if (!Array.isArray(taskGroups) || taskGroups.length === 0) {
    return new Date();
  }

  let latestDate = new Date();
  let foundAnyValidDate = false;

  taskGroups.forEach((group) => {
    if (!group || !Array.isArray(group.tasks)) return;

    group.tasks.forEach((task) => {
      if (task && task.endDate instanceof Date) {
        if (!foundAnyValidDate) {
          latestDate = new Date(task.endDate);
          foundAnyValidDate = true;
        } else if (task.endDate > latestDate) {
          latestDate = new Date(task.endDate);
        }
      }
    });
  });

  if (!foundAnyValidDate) {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 2, 0);
  }

  return new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 0);
}
