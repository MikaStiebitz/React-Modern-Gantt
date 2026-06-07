import React, { useState } from 'react';
import { Task, TaskGroup, ViewMode } from 'react-modern-gantt';
import { useTheme } from '../../context/ThemeContext';
import GanttChart from 'react-modern-gantt';
import 'react-modern-gantt/dist/index.css';

const GranularControlsDemo: React.FC = () => {
  const { darkMode } = useTheme();

  // Generate initial task data
  const generateInitialTasks = (): TaskGroup[] => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return [
      {
        id: 'dev-team',
        name: 'Development',
        description: 'Dev Team Tasks',
        tasks: [
          {
            id: 'demo-task-1',
            name: 'Frontend Development',
            startDate: new Date(currentYear, currentMonth, 1),
            endDate: new Date(currentYear, currentMonth, 15),
            color: '#3B82F6',
            percent: 65,
          },
          {
            id: 'demo-task-2',
            name: 'Backend API',
            startDate: new Date(currentYear, currentMonth, 10),
            endDate: new Date(currentYear, currentMonth, 25),
            color: '#10B981',
            percent: 40,
          },
        ],
      },
      {
        id: 'design-team',
        name: 'Design',
        description: 'Design Team Tasks',
        tasks: [
          {
            id: 'demo-task-3',
            name: 'UI/UX Design',
            startDate: new Date(currentYear, currentMonth, 5),
            endDate: new Date(currentYear, currentMonth, 20),
            color: '#F59E0B',
            percent: 80,
          },
        ],
      },
    ];
  };

  const [tasks, setTasks] = useState<TaskGroup[]>(generateInitialTasks());

  // Master switch
  const [editMode, setEditMode] = useState(true);

  // Granular controls
  const [allowProgressEdit, setAllowProgressEdit] = useState(true);
  const [allowTaskResize, setAllowTaskResize] = useState(true);
  const [allowTaskMove, setAllowTaskMove] = useState(true);
  const [showProgress, setShowProgress] = useState(true);

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

  // Preset functions
  const setFullyEditable = () => {
    setEditMode(true);
    setAllowProgressEdit(true);
    setAllowTaskResize(true);
    setAllowTaskMove(true);
    setShowProgress(true);
  };

  const setReadOnly = () => {
    setEditMode(false);
    setShowProgress(true);
  };

  const setMoveOnly = () => {
    setEditMode(true);
    setAllowProgressEdit(false);
    setAllowTaskResize(false);
    setAllowTaskMove(true);
    setShowProgress(true);
  };

  const setResizeOnly = () => {
    setEditMode(true);
    setAllowProgressEdit(false);
    setAllowTaskResize(true);
    setAllowTaskMove(false);
    setShowProgress(true);
  };

  const setProgressOnly = () => {
    setEditMode(true);
    setAllowProgressEdit(true);
    setAllowTaskResize(false);
    setAllowTaskMove(false);
    setShowProgress(true);
  };

  const setViewProgress = () => {
    setEditMode(true);
    setAllowProgressEdit(false);
    setAllowTaskResize(true);
    setAllowTaskMove(true);
    setShowProgress(true);
  };

  return (
    <div className="granular-demo-container">
      <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <p className="mb-3">
          This interactive demo allows you to experiment with different permission combinations in real-time. Toggle
          individual features to see how they interact with the master <code>editMode</code> switch.
        </p>
        <p className="text-sm">
          Use the quick presets to jump to common configurations, or customize your own combination. The live code
          preview shows the exact props needed to replicate the current configuration.
        </p>
      </div>

      {/* Control Panel */}
      <div
        className={`control-panel p-6 rounded-lg mb-6 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Control Panel</h3>

        {/* Master Switch */}
        <div
          className={`master-switch p-4 rounded-md mb-4 border-2 ${
            darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-300'
          }`}>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={editMode}
              onChange={e => setEditMode(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className={`ml-3 font-semibold ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
              🔧 Edit Mode (Master Switch)
            </span>
          </label>
          <p className={`mt-2 text-sm ml-8 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            When OFF, disables ALL editing features below
          </p>
        </div>

        {/* Individual Controls */}
        <div className="individual-controls ml-4 space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showProgress}
              onChange={e => setShowProgress(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>📊 Show Progress Bars</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowProgressEdit}
              onChange={e => setAllowProgressEdit(e.target.checked)}
              disabled={!editMode || !showProgress}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span
              className={`ml-3 ${
                !editMode || !showProgress
                  ? darkMode
                    ? 'text-gray-600'
                    : 'text-gray-400'
                  : darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}>
              ✏️ Allow Progress Editing
              <span className={`ml-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                (requires Edit Mode + Show Progress)
              </span>
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowTaskResize}
              onChange={e => setAllowTaskResize(e.target.checked)}
              disabled={!editMode}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span
              className={`ml-3 ${
                !editMode
                  ? darkMode
                    ? 'text-gray-600'
                    : 'text-gray-400'
                  : darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}>
              ↔️ Allow Task Resizing
              <span className={`ml-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                (requires Edit Mode)
              </span>
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowTaskMove}
              onChange={e => setAllowTaskMove(e.target.checked)}
              disabled={!editMode}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span
              className={`ml-3 ${
                !editMode
                  ? darkMode
                    ? 'text-gray-600'
                    : 'text-gray-400'
                  : darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}>
              🚚 Allow Task Movement
              <span className={`ml-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                (requires Edit Mode)
              </span>
            </span>
          </label>
        </div>

        {/* Current State Summary */}
        <div
          className={`state-summary mt-4 p-4 rounded-md ${
            darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
          <div className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Current State:</div>
          <div className={`space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <div>
              • Tasks can be moved:{' '}
              <strong className={editMode && allowTaskMove ? 'text-green-500' : 'text-red-500'}>
                {editMode && allowTaskMove ? '✅ Yes' : '❌ No'}
              </strong>
            </div>
            <div>
              • Tasks can be resized:{' '}
              <strong className={editMode && allowTaskResize ? 'text-green-500' : 'text-red-500'}>
                {editMode && allowTaskResize ? '✅ Yes' : '❌ No'}
              </strong>
            </div>
            <div>
              • Progress can be edited:{' '}
              <strong className={editMode && showProgress && allowProgressEdit ? 'text-green-500' : 'text-red-500'}>
                {editMode && showProgress && allowProgressEdit ? '✅ Yes' : '❌ No'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div
        className={`rounded-xl overflow-hidden mb-6 ${
          darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg`}>
        <GanttChart
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          editMode={editMode}
          showProgress={showProgress}
          // Note: allowProgressEdit, allowTaskResize, allowTaskMove are available in v0.6.0+
          // Uncomment these props once you upgrade to react-modern-gantt v0.6.0:
          // allowProgressEdit={allowProgressEdit}
          // allowTaskResize={allowTaskResize}
          // allowTaskMove={allowTaskMove}
          darkMode={darkMode}
          viewMode={ViewMode.MONTH}
          title="Interactive Demo"
          headerLabel="Teams"
        />
      </div>

      {/* Quick Presets */}
      <div className="quick-presets mb-6">
        <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quick Presets</h3>
        <div className="preset-buttons flex flex-wrap gap-2">
          <button
            onClick={setFullyEditable}
            className="preset-btn preset-full px-4 py-2 rounded-md text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: '#10b981' }}>
            ✅ Fully Editable
          </button>

          <button
            onClick={setReadOnly}
            className="preset-btn preset-readonly px-4 py-2 rounded-md text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: '#6b7280' }}>
            🔒 Read-Only
          </button>

          <button
            onClick={setMoveOnly}
            className="preset-btn preset-move px-4 py-2 rounded-md text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: '#3b82f6' }}>
            🚚 Move Only
          </button>

          <button
            onClick={setResizeOnly}
            className="preset-btn preset-resize px-4 py-2 rounded-md text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: '#8b5cf6' }}>
            ↔️ Resize Only
          </button>

          <button
            onClick={setProgressOnly}
            className="preset-btn preset-progress px-4 py-2 rounded-md text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: '#f59e0b' }}>
            ✏️ Progress Only
          </button>

          <button
            onClick={setViewProgress}
            className="preset-btn preset-view px-4 py-2 rounded-md text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: '#ec4899' }}>
            📊 View Progress (No Edit)
          </button>
        </div>
      </div>

      {/* Code Example */}
      <div
        className={`code-preview rounded-lg p-4 overflow-x-auto ${
          darkMode ? 'bg-gray-950 border border-gray-800' : 'bg-gray-900 border border-gray-700'
        }`}>
        <h3 className="text-gray-100 font-semibold mb-3">Current Configuration (v0.6.0+):</h3>
        <pre className="text-sm text-gray-300 font-mono">
          <code>{`<GanttChart
  tasks={tasks}
  editMode={${editMode}}
  showProgress={${showProgress}}
  // Available in react-modern-gantt v0.6.0+:
  allowProgressEdit={${allowProgressEdit}}
  allowTaskResize={${allowTaskResize}}
  allowTaskMove={${allowTaskMove}}
  onTaskUpdate={handleTaskUpdate}
/>`}</code>
        </pre>
      </div>
    </div>
  );
};

export default GranularControlsDemo;
