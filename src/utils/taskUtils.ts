import { Task } from '@/types';

/**
 * Detects task overlaps and organizes them into rows
 */
export function detectTaskOverlaps(tasks: Task[]): Task[][] {
  // Validate input
  if (!Array.isArray(tasks)) {
    return [];
  }

  // Filter out tasks with invalid dates
  const validTasks = tasks.filter(
    task =>
      task &&
      task.startDate instanceof Date &&
      task.endDate instanceof Date &&
      !isNaN(task.startDate.getTime()) &&
      !isNaN(task.endDate.getTime())
  );

  if (validTasks.length === 0) {
    return [];
  }

  const rows: Task[][] = [];

  validTasks.forEach(task => {
    let placed = false;

    // Check each existing row for collisions
    for (let i = 0; i < rows.length; i++) {
      // A task can be placed in this row if it doesn't overlap with ANY task in the row
      const hasCollision = rows[i].some(existingTask => {
        // Check if date ranges overlap
        return !(task.startDate >= existingTask.endDate || task.endDate <= existingTask.startDate);
      });

      // If no collision in this row, place the task here
      if (!hasCollision) {
        rows[i].push(task);
        placed = true;
        break;
      }
    }

    // If task couldn't be placed in any existing row, create a new row
    if (!placed) {
      rows.push([task]);
    }
  });

  return rows;
}
