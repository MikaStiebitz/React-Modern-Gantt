import React from 'react';
import { render } from '@testing-library/react';
import { GanttChart } from '../../src/components/core';
import { TaskGroup } from '../../src/types';

const groups: TaskGroup[] = [
  {
    id: 'g1',
    name: 'Group 1',
    tasks: [
      { id: 't1', name: 'One', startDate: new Date(2024, 0, 1), endDate: new Date(2024, 0, 10) },
      { id: 't2', name: 'Two', startDate: new Date(2024, 1, 1), endDate: new Date(2024, 1, 10) },
      { id: 't3', name: 'Three', startDate: new Date(2024, 2, 1), endDate: new Date(2024, 2, 10) },
    ],
  },
];

const groupHeight = (container: HTMLElement) => {
  const row = container.querySelector('.rmg-task-row') as HTMLElement;
  return parseInt(row.style.height, 10);
};

describe('GanttChart stackTasks', () => {
  test('packs non-overlapping tasks onto one row by default', () => {
    const { container } = render(<GanttChart tasks={groups} />);
    expect(groupHeight(container)).toBe(60);
  });

  test('gives every task its own row when stackTasks is set', () => {
    const { container } = render(<GanttChart tasks={groups} stackTasks />);
    expect(groupHeight(container)).toBe(3 * 40 + 20);
  });
});
