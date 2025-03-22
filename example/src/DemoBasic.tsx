import * as React from "react";
import { Task, TaskGroup } from "react-modern-gantt";
import { GanttChart } from "react-modern-gantt";
import "../../dist/dist/index.css";
import { basicDemoData } from "./data";

interface DemoBasicProps {
    darkMode: boolean;
}

const DemoBasic: React.FC<DemoBasicProps> = ({ darkMode }: DemoBasicProps) => {
    const [tasks, setTasks] = React.useState<TaskGroup[]>(basicDemoData);

    // Handle task updates
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

    // Handle task click
    const handleTaskClick = (task: Task, group: TaskGroup) => {
        console.log("Task clicked:", task.name, "in group:", group.name);
    };

    // Handle group click
    const handleGroupClick = (group: TaskGroup) => {
        console.log("Group clicked:", group.name);
    };

    return (
        <div>
            <div className="control-panel">
                <button onClick={() => setTasks(basicDemoData)}>Reset Demo</button>
            </div>

            <GanttChart
                tasks={tasks}
                title="Project Timeline"
                darkMode={darkMode}
                showProgress={true}
                onTaskUpdate={handleTaskUpdate}
                onTaskClick={handleTaskClick}
                onGroupClick={handleGroupClick}
            />
        </div>
    );
};

export default DemoBasic;
