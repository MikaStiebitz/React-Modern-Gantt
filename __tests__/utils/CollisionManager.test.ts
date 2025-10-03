import { CollisionService } from '../../src/services/CollisionService';
import { Task, ViewMode } from '../../src/types';

describe('CollisionService', () => {
  describe('detectOverlaps', () => {
    test('correctly detects non-overlapping tasks', () => {
      const tasks: Task[] = [
        {
          id: '1',
          name: 'Task 1',
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 0, 15),
        },
        {
          id: '2',
          name: 'Task 2',
          startDate: new Date(2023, 0, 16),
          endDate: new Date(2023, 0, 31),
        },
      ];

      const rows = CollisionService.detectOverlaps(tasks);

      expect(rows.length).toBe(1); // Should be arranged in 1 row
      expect(rows[0].length).toBe(2); // Contains both tasks
    });

    test('correctly detects overlapping tasks', () => {
      const tasks: Task[] = [
        {
          id: '1',
          name: 'Task 1',
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 0, 15),
        },
        {
          id: '2',
          name: 'Task 2',
          startDate: new Date(2023, 0, 10), // Overlaps with Task 1
          endDate: new Date(2023, 0, 31),
        },
      ];

      const rows = CollisionService.detectOverlaps(tasks);

      expect(rows.length).toBe(2); // Should be arranged in 2 rows
      expect(rows[0].length).toBe(1); // Each row contains 1 task
      expect(rows[1].length).toBe(1);
    });

    test('handles empty task array', () => {
      const rows = CollisionService.detectOverlaps([]);
      expect(rows.length).toBe(0);
    });
  });

  describe('wouldCollide', () => {
    test('detects collision with existing tasks', () => {
      const task: Task = {
        id: '1',
        name: 'New Task',
        startDate: new Date(2023, 0, 10),
        endDate: new Date(2023, 0, 20),
      };

      const existingTasks: Task[] = [
        {
          id: '2',
          name: 'Existing Task',
          startDate: new Date(2023, 0, 15), // Overlaps with new task
          endDate: new Date(2023, 0, 25),
        },
      ];

      const wouldCollide = CollisionService.wouldCollide(task, existingTasks);

      expect(wouldCollide).toBe(true);
    });

    test('ignores self-collision', () => {
      const task: Task = {
        id: '1',
        name: 'Task',
        startDate: new Date(2023, 0, 10),
        endDate: new Date(2023, 0, 20),
      };

      const existingTasks: Task[] = [task]; // Same task

      const wouldCollide = CollisionService.wouldCollide(task, existingTasks);

      expect(wouldCollide).toBe(false);
    });

    test('ignores excluded task', () => {
      const task: Task = {
        id: '1',
        name: 'Task 1',
        startDate: new Date(2023, 0, 10),
        endDate: new Date(2023, 0, 20),
      };

      const existingTasks: Task[] = [
        {
          id: '2',
          name: 'Task 2',
          startDate: new Date(2023, 0, 15), // Overlaps with task 1
          endDate: new Date(2023, 0, 25),
        },
      ];

      // Fixed: Add ViewMode as the third parameter and "2" as the fourth parameter
      const wouldCollide = CollisionService.wouldCollide(task, existingTasks, ViewMode.MONTH, '2');

      expect(wouldCollide).toBe(false);
    });
  });

  describe('getPreviewArrangement', () => {
    test('calculates arrangement with updated task', () => {
      const originalTask: Task = {
        id: '1',
        name: 'Task 1',
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 0, 10),
      };

      const otherTask: Task = {
        id: '2',
        name: 'Task 2',
        startDate: new Date(2023, 0, 15),
        endDate: new Date(2023, 0, 25),
      };

      const allTasks: Task[] = [originalTask, otherTask];

      // Update task 1 to overlap with task 2
      const updatedTask: Task = {
        ...originalTask,
        startDate: new Date(2023, 0, 12),
        endDate: new Date(2023, 0, 22),
      };

      const arrangement = CollisionService.getPreviewArrangement(updatedTask, allTasks);

      expect(arrangement.length).toBe(2); // Tasks should be in 2 rows due to overlap
    });
  });
});
