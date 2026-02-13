import * as React from "react";
import GanttChart, { Task, TaskGroup, ViewMode } from "react-modern-gantt";
import { basicDemoData } from "./data";

interface DemoTimelineHeaderProps {
    darkMode: boolean;
}

const DemoTimelineHeader: React.FC<DemoTimelineHeaderProps> = ({ darkMode }: DemoTimelineHeaderProps) => {
    const [tasks, setTasks] = React.useState<TaskGroup[]>(basicDemoData);
    const [showTimelineHeader, setShowTimelineHeader] = React.useState<boolean>(true);
    const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.WEEK);

    // Handle task updates
    const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
        setTasks(prevTasks =>
            prevTasks.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
                      }
                    : group,
            ),
        );
    };

    return (
        <div>
            <div className="control-panel">
                <div style={{ marginBottom: "15px" }}>
                    <h3>Timeline Header Configuration</h3>
                    <label style={{ marginRight: "20px" }}>
                        <input
                            type="checkbox"
                            checked={showTimelineHeader}
                            onChange={e => setShowTimelineHeader(e.target.checked)}
                        />{" "}
                        Show Timeline Header (Month + Year in Week View)
                    </label>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <h3>View Mode</h3>
                    <p style={{ margin: "0 0 10px 0" }}>
                        Current: <strong>{viewMode}</strong>
                    </p>
                    <p style={{ fontSize: "12px", color: "#666" }}>
                        Note: The timeline header only appears in Week, Day, Hour, and Minute view modes. In Week view
                        with header enabled, you'll see both "W1, W2, etc." and "Jan 2024" above. With header disabled,
                        you'll only see "W1, W2, etc."
                    </p>
                </div>

                <button onClick={() => setViewMode(ViewMode.WEEK)}>View: Week</button>
                <button onClick={() => setViewMode(ViewMode.DAY)} style={{ marginLeft: "10px" }}>
                    View: Day
                </button>
                <button onClick={() => setViewMode(ViewMode.MONTH)} style={{ marginLeft: "10px" }}>
                    View: Month
                </button>
            </div>

            <GanttChart
                tasks={tasks}
                title="Timeline Header Configuration Demo"
                darkMode={darkMode}
                showProgress={true}
                viewMode={viewMode}
                showTimelineHeader={showTimelineHeader}
                onTaskUpdate={handleTaskUpdate}
            />
        </div>
    );
};

export default DemoTimelineHeader;
