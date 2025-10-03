import { TaskService } from '../../src/services/TaskService';
import { Task, ViewMode } from '../../src/types';

describe('TaskService', () => {
  describe('calculateDatesFromPosition', () => {
    test('calculates correct dates from pixel position', () => {
      const startDate = new Date(2023, 0, 1); // Jan 1
      const endDate = new Date(2023, 1, 28); // Feb 28
      const totalMonths = 2;
      const monthWidth = 150;

      // Left = 75px (25% of timeline), Width = 75px (25% of timeline)
      const { newStartDate, newEndDate } = TaskService.calculateDatesFromPosition(
        75,
        75,
        startDate,
        endDate,
        totalMonths,
        monthWidth
      );

      // Should be around Jan 15 to Jan 30
      expect(newStartDate.getMonth()).toBe(0); // January
      expect(newStartDate.getDate()).toBeGreaterThan(10);
      expect(newEndDate.getMonth()).toBe(0); // January
    });

    test('constrains dates to timeline boundaries', () => {
      const startDate = new Date(2023, 0, 1);
      const endDate = new Date(2023, 1, 28);
      const totalMonths = 2;
      const monthWidth = 150;

      // Try to position task before timeline start
      const { newStartDate, newEndDate } = TaskService.calculateDatesFromPosition(
        -50,
        75,
        startDate,
        endDate,
        totalMonths,
        monthWidth
      );

      // Should be constrained to start at timeline start
      expect(newStartDate.getTime()).toBe(startDate.getTime());
      expect(newEndDate.getTime()).toBeGreaterThan(startDate.getTime());
    });
  });

  describe('createUpdatedTask', () => {
    test('creates task with updated dates', () => {
      const task: Task = {
        id: '1',
        name: 'Test Task',
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 0, 15),
        percent: 50,
      };

      const newStartDate = new Date(2023, 0, 10);
      const newEndDate = new Date(2023, 0, 25);

      const updatedTask = TaskService.createUpdatedTask(task, newStartDate, newEndDate);

      expect(updatedTask.id).toBe('1');
      expect(updatedTask.name).toBe('Test Task');
      expect(updatedTask.startDate.getTime()).toBe(newStartDate.getTime());
      expect(updatedTask.endDate.getTime()).toBe(newEndDate.getTime());
      expect(updatedTask.percent).toBe(50); // Other properties preserved
    });
  });

  describe('calculateTaskPixelPosition', () => {
    test('calculates correct pixel position', () => {
      const task: Task = {
        id: '1',
        name: 'Test Task',
        startDate: new Date(2023, 0, 15), // Middle of January
        endDate: new Date(2023, 0, 31), // End of January
      };

      const startDate = new Date(2023, 0, 1); // January
      const endDate = new Date(2023, 1, 28); // February
      const totalMonths = 2;
      const monthWidth = 150;

      const { leftPx, widthPx } = TaskService.calculateTaskPixelPosition(
        task,
        startDate,
        endDate,
        totalMonths,
        monthWidth
      );

      // Task starts halfway through month 1 of 2
      // So left should be around 75px (25% of total width)
      expect(leftPx).toBeGreaterThan(50);
      expect(leftPx).toBeLessThan(100);

      // Task spans about half a month out of 2 months
      // So width should be around 75px (25% of total width)
      expect(widthPx).toBeGreaterThan(50);
      expect(widthPx).toBeLessThan(100);
    });

    test('constrains task to timeline boundaries', () => {
      const task: Task = {
        id: '1',
        name: 'Test Task',
        startDate: new Date(2022, 11, 15), // December 15, 2022 (before timeline)
        endDate: new Date(2023, 2, 15), // March 15, 2023 (after timeline)
      };

      const startDate = new Date(2023, 0, 1); // January 1, 2023
      const endDate = new Date(2023, 1, 28); // February 28, 2023
      const totalMonths = 2;
      const monthWidth = 150;

      const { leftPx, widthPx } = TaskService.calculateTaskPixelPosition(
        task,
        startDate,
        endDate,
        totalMonths,
        monthWidth
      );

      // Task should be constrained to start at timeline start
      expect(leftPx).toBe(0);

      // Task width should be positive
      expect(widthPx).toBeGreaterThan(20);
    });
  });

  describe('getLiveDatesFromElement', () => {
    test('returns timeline dates when element is null', () => {
      const startDate = new Date(2023, 0, 1);
      const endDate = new Date(2023, 1, 28);
      const totalMonths = 2;
      const monthWidth = 150;

      const { startDate: resultStartDate, endDate: resultEndDate } = TaskService.getLiveDatesFromElement(
        null,
        startDate,
        endDate,
        totalMonths,
        monthWidth
      );

      expect(resultStartDate.getTime()).toBe(startDate.getTime());
      expect(resultEndDate.getTime()).toBe(endDate.getTime());
    });
  });
});
