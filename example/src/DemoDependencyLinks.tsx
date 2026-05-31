import * as React from "react";
import GanttChart, { Task, TaskGroup } from "react-modern-gantt";
import { complexDemoData } from "./data";

interface DemoDependencyLinksProps {
    darkMode: boolean;
}

const DemoDependencyLinks: React.FC<DemoDependencyLinksProps> = ({ darkMode }) => {
    const [tasks, setTasks] = React.useState<TaskGroup[]>(complexDemoData);
    const [showLinks, setShowLinks] = React.useState(true);

    const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
        setTasks(prev =>
            prev.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)),
                      }
                    : group,
            ),
        );
    };

    return (
        <div>
            <div className="control-panel">
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={showLinks}
                        onChange={e => setShowLinks(e.target.checked)}
                    />
                    Show dependency links
                </label>
                <button onClick={() => setTasks(complexDemoData)}>Reset</button>
            </div>

            <GanttChart
                tasks={tasks}
                title="Project Dependencies"
                darkMode={darkMode}
                showProgress={true}
                showDependencyLinks={showLinks}
                onTaskUpdate={handleTaskUpdate}
            />
        </div>
    );
};

export default DemoDependencyLinks;
