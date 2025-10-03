import * as React from 'react';
import { GanttChart, TaskGroup, Task } from '../../src';

const initialTasks: TaskGroup[] = [
  {
    id: 'team-1',
    name: 'Development Team',
    description: 'Software development tasks',
    tasks: [
      {
        id: 'task-1',
        name: 'Frontend Development',
        startDate: new Date(2024, 0, 1),
        endDate: new Date(2024, 0, 10),
        percent: 45,
        color: '#3b82f6',
      },
      {
        id: 'task-2',
        name: 'Backend API',
        startDate: new Date(2024, 0, 5),
        endDate: new Date(2024, 0, 15),
        percent: 70,
        color: '#10b981',
      },
    ],
  },
  {
    id: 'team-2',
    name: 'Design Team',
    description: 'UI/UX design tasks',
    tasks: [
      {
        id: 'task-3',
        name: 'UI Mockups',
        startDate: new Date(2024, 0, 3),
        endDate: new Date(2024, 0, 8),
        percent: 100,
        color: '#ec4899',
      },
    ],
  },
];

export const DemoGranularControls: React.FC = () => {
  const [tasks, setTasks] = React.useState<TaskGroup[]>(initialTasks);

  // Master switch
  const [editMode, setEditMode] = React.useState(true);

  // Granular controls
  const [allowProgressEdit, setAllowProgressEdit] = React.useState(true);
  const [allowTaskResize, setAllowTaskResize] = React.useState(true);
  const [allowTaskMove, setAllowTaskMove] = React.useState(true);

  const [showProgress, setShowProgress] = React.useState(true);

  const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
            }
          : group
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Granular Editing Controls Demo</h2>

      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">Control Panel</h3>

        {/* Master Switch */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
          <label className="flex items-center gap-2 font-medium text-blue-900 dark:text-blue-100">
            <input
              type="checkbox"
              checked={editMode}
              onChange={e => setEditMode(e.target.checked)}
              className="w-4 h-4"
            />
            🔧 Edit Mode (Master Switch)
          </label>
          <p className="text-xs mt-1 text-blue-700 dark:text-blue-300 ml-6">
            When OFF, disables ALL editing features below
          </p>
        </div>

        {/* Individual Controls */}
        <div className="space-y-2 ml-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showProgress}
              onChange={e => setShowProgress(e.target.checked)}
              className="w-4 h-4"
            />
            📊 Show Progress Bars
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowProgressEdit}
              onChange={e => setAllowProgressEdit(e.target.checked)}
              disabled={!editMode || !showProgress}
              className="w-4 h-4 disabled:opacity-50"
            />
            ✏️ Allow Progress Editing
            <span className="text-xs text-gray-500">(requires Edit Mode + Show Progress)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowTaskResize}
              onChange={e => setAllowTaskResize(e.target.checked)}
              disabled={!editMode}
              className="w-4 h-4 disabled:opacity-50"
            />
            ↔️ Allow Task Resizing
            <span className="text-xs text-gray-500">(requires Edit Mode)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowTaskMove}
              onChange={e => setAllowTaskMove(e.target.checked)}
              disabled={!editMode}
              className="w-4 h-4 disabled:opacity-50"
            />
            🚚 Allow Task Movement
            <span className="text-xs text-gray-500">(requires Edit Mode)</span>
          </label>
        </div>

        {/* Current State Summary */}
        <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded text-sm">
          <div className="font-semibold mb-2">Current State:</div>
          <div className="space-y-1 text-xs">
            <div>
              • Tasks can be moved: <strong>{editMode && allowTaskMove ? '✅ Yes' : '❌ No'}</strong>
            </div>
            <div>
              • Tasks can be resized: <strong>{editMode && allowTaskResize ? '✅ Yes' : '❌ No'}</strong>
            </div>
            <div>
              • Progress can be edited:{' '}
              <strong>{editMode && showProgress && allowProgressEdit ? '✅ Yes' : '❌ No'}</strong>
            </div>
          </div>
        </div>
      </div>

      <GanttChart
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        editMode={editMode}
        showProgress={showProgress}
        allowProgressEdit={allowProgressEdit}
        allowTaskResize={allowTaskResize}
        allowTaskMove={allowTaskMove}
        darkMode={false}
      />

      {/* Common Configurations */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEditMode(true);
              setAllowProgressEdit(true);
              setAllowTaskResize(true);
              setAllowTaskMove(true);
              setShowProgress(true);
            }}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
            ✅ Fully Editable
          </button>

          <button
            onClick={() => {
              setEditMode(false);
              setShowProgress(true);
            }}
            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">
            🔒 Read-Only
          </button>

          <button
            onClick={() => {
              setEditMode(true);
              setAllowProgressEdit(false);
              setAllowTaskResize(false);
              setAllowTaskMove(true);
              setShowProgress(true);
            }}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
            🚚 Move Only
          </button>

          <button
            onClick={() => {
              setEditMode(true);
              setAllowProgressEdit(false);
              setAllowTaskResize(true);
              setAllowTaskMove(false);
              setShowProgress(true);
            }}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm">
            ↔️ Resize Only
          </button>

          <button
            onClick={() => {
              setEditMode(true);
              setAllowProgressEdit(true);
              setAllowTaskResize(false);
              setAllowTaskMove(false);
              setShowProgress(true);
            }}
            className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm">
            ✏️ Progress Only
          </button>

          <button
            onClick={() => {
              setEditMode(true);
              setAllowProgressEdit(false);
              setAllowTaskResize(true);
              setAllowTaskMove(true);
              setShowProgress(true);
            }}
            className="px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm">
            📊 View Progress (No Edit)
          </button>
        </div>
      </div>

      {/* Code Example */}
      <div className="mt-6 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
        <pre className="text-xs">
          {`<GanttChart
  tasks={tasks}
  editMode={${editMode}}
  showProgress={${showProgress}}
  allowProgressEdit={${allowProgressEdit}}
  allowTaskResize={${allowTaskResize}}
  allowTaskMove={${allowTaskMove}}
  onTaskUpdate={handleTaskUpdate}
/>`}
        </pre>
      </div>
    </div>
  );
};
