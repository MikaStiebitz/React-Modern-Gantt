import * as React from 'react';
import { useState, useCallback } from 'react';
import { GanttChart, Task, TaskGroup, ViewMode } from '../../src';
import { addDays, addMonths, subMonths } from 'date-fns';

interface DemoInfiniteScrollProps {
  darkMode?: boolean;
}

const DemoInfiniteScroll: React.FC<DemoInfiniteScrollProps> = ({ darkMode = false }) => {
  const today = new Date();

  // Initial timeline boundaries
  const [startDate, setStartDate] = useState<Date>(subMonths(today, 2));
  const [endDate, setEndDate] = useState<Date>(addMonths(today, 4));
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState<boolean>(true);

  // Sample tasks
  const [tasks, setTasks] = useState<TaskGroup[]>([
    {
      id: 'team-1',
      name: 'Development Team',
      description: 'Main development tasks',
      tasks: [
        {
          id: 't1',
          name: 'Frontend Development',
          startDate: addDays(today, -10),
          endDate: addDays(today, 30),
          color: '#3b82f6',
          percent: 65,
        },
        {
          id: 't2',
          name: 'Backend API',
          startDate: addDays(today, -5),
          endDate: addDays(today, 25),
          color: '#10b981',
          percent: 40,
        },
      ],
    },
    {
      id: 'team-2',
      name: 'Design Team',
      description: 'UI/UX design tasks',
      tasks: [
        {
          id: 't3',
          name: 'UI Design',
          startDate: addDays(today, 5),
          endDate: addDays(today, 35),
          color: '#f59e0b',
          percent: 20,
        },
        {
          id: 't4',
          name: 'UX Research',
          startDate: today,
          endDate: addDays(today, 15),
          color: '#8b5cf6',
          percent: 80,
        },
      ],
    },
  ]);

  // Handle timeline extension
  const handleTimelineExtend = useCallback((direction: 'left' | 'right', newStartDate: Date, newEndDate: Date) => {
    console.log(`📅 Timeline extended ${direction}:`, {
      newStartDate: newStartDate.toLocaleDateString(),
      newEndDate: newEndDate.toLocaleDateString(),
    });

    // Update timeline boundaries
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    // You could also fetch more data here
    // fetchAdditionalTasks(direction, newStartDate, newEndDate);
  }, []);

  // Handle task updates
  const handleTaskUpdate = useCallback((groupId: string, updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            tasks: group.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
          };
        }
        return group;
      })
    );
  }, []);

  return (
    <div className="demo-infinite-scroll">
      {/* Controls */}
      <div className="demo-controls" style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={infiniteScrollEnabled}
            onChange={e => setInfiniteScrollEnabled(e.target.checked)}
          />
          <span>Enable Infinite Scroll</span>
        </label>
        <p style={{ fontSize: '0.875rem', marginTop: '8px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
          {infiniteScrollEnabled
            ? '✅ When dragging tasks to the edge, the timeline will automatically extend.'
            : '⚠️ Timeline extension is disabled. Tasks are bounded by the current view.'}
        </p>
        <div style={{ fontSize: '0.875rem', marginTop: '8px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
          <strong>Timeline:</strong> {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </div>
      </div>

      {/* Gantt Chart */}
      <GanttChart
        tasks={tasks}
        startDate={startDate}
        endDate={endDate}
        title="Infinite Scroll Demo"
        darkMode={darkMode}
        editMode={true}
        showProgress={true}
        viewMode={ViewMode.WEEK}
        viewModes={[ViewMode.DAY, ViewMode.WEEK, ViewMode.MONTH]}
        infiniteScroll={infiniteScrollEnabled}
        onTimelineExtend={handleTimelineExtend}
        onTaskUpdate={handleTaskUpdate}
        showCurrentDateMarker={true}
      />

      {/* Instructions */}
      <div
        className="demo-instructions"
        style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: darkMode ? '#374151' : '#f3f4f6',
          borderRadius: '8px',
        }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: 600 }}>💡 Try it out:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem' }}>
          <li>Enable Infinite Scroll above</li>
          <li>Drag a task towards the left or right edge of the timeline</li>
          <li>Watch as the timeline automatically extends to accommodate the movement</li>
          <li>Try different view modes to see how extension adapts to the scale</li>
          <li>Drag the progress bar bubble to update task completion</li>
        </ul>
      </div>
    </div>
  );
};

export default DemoInfiniteScroll;
