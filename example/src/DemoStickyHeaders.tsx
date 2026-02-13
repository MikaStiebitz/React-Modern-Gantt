import * as React from "react";
import GanttChart, { Task, TaskGroup } from "react-modern-gantt";

interface DemoStickyHeadersProps {
    darkMode: boolean;
}

const DemoStickyHeaders: React.FC<DemoStickyHeadersProps> = ({ darkMode }: DemoStickyHeadersProps) => {
    // Generate many tasks to enable scrolling
    const generateLargeDemoData = (): TaskGroup[] => {
        const groups: TaskGroup[] = [];
        const startDate = new Date(2026, 1, 1); // Feb 1, 2026

        // Create 15 groups with multiple tasks each
        for (let i = 1; i <= 15; i++) {
            const tasks: Task[] = [];

            // Each group has 3-5 tasks
            const taskCount = 3 + (i % 3);
            for (let j = 1; j <= taskCount; j++) {
                const taskStart = new Date(startDate);
                taskStart.setDate(startDate.getDate() + i * 7 + j * 2);

                const taskEnd = new Date(taskStart);
                taskEnd.setDate(taskStart.getDate() + 5 + j * 2);

                tasks.push({
                    id: `task-${i}-${j}`,
                    name: `Task ${j} for Team ${i}`,
                    start: taskStart,
                    end: taskEnd,
                    progress: Math.floor(Math.random() * 100),
                    color: j === 1 ? "#3b82f6" : j === 2 ? "#10b981" : "#8b5cf6",
                });
            }

            groups.push({
                id: `team-${i}`,
                name: `Team ${i} - ${i <= 5 ? "Frontend" : i <= 10 ? "Backend" : "DevOps"}`,
                tasks,
            });
        }

        return groups;
    };

    const [tasks, setTasks] = React.useState<TaskGroup[]>(generateLargeDemoData());

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
                <button onClick={() => setTasks(generateLargeDemoData())}>Regenerate Data</button>
                <p style={{ marginTop: "10px", fontSize: "14px", color: darkMode ? "#9ca3af" : "#6b7280" }}>
                    📌 Scroll down to see sticky headers in action!
                </p>
            </div>

            <GanttChart
                tasks={tasks}
                title="Large Project Timeline"
                darkMode={darkMode}
                showProgress={true}
                onTaskUpdate={handleTaskUpdate}
                maxHeight={500}
            />
        </div>
    );
};

export default DemoStickyHeaders;
