import * as React from "react";
import GanttChart, { Task, TaskGroup, ViewMode } from "react-modern-gantt";
import { complexDemoData, yearLongProjectData, hourlyDemoData } from "./data";

interface DemoViewModesProps {
  darkMode: boolean;
}

const DemoViewModes: React.FC<DemoViewModesProps> = ({
  darkMode,
}: DemoViewModesProps) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.MONTH);
  const [demoType, setDemoType] = React.useState<
    "complex" | "yearLong" | "hourly"
  >("complex");
  const [tasks, setTasks] = React.useState<TaskGroup[]>(complexDemoData);

  // Handle view mode change
  const handleViewModeChange = (newMode: ViewMode) => {
    setViewMode(newMode);
    console.log("View mode changed to:", newMode);
  };

  // Handle task updates (including progress updates)
  const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task,
              ),
            }
          : group,
      ),
    );

    // Log different types of updates
    if (updatedTask.percent !== undefined) {
      console.log(
        "Progress updated:",
        updatedTask.name,
        updatedTask.percent + "%",
      );
    } else {
      console.log("Task updated:", updatedTask);
    }
  };

  // Switch between demo types
  const handleDemoTypeChange = (type: "complex" | "yearLong" | "hourly") => {
    setDemoType(type);

    if (type === "complex") {
      setTasks(complexDemoData);
      if (viewMode === ViewMode.HOUR || viewMode === ViewMode.MINUTE) {
        setViewMode(ViewMode.MONTH);
      }
    } else if (type === "yearLong") {
      setTasks(yearLongProjectData);
      if (
        viewMode === ViewMode.DAY ||
        viewMode === ViewMode.HOUR ||
        viewMode === ViewMode.MINUTE
      ) {
        setViewMode(ViewMode.MONTH);
      }
    } else if (type === "hourly") {
      setTasks(hourlyDemoData);
      setViewMode(ViewMode.HOUR);
    }
  };

  return (
    <div>
      <div className="control-panel">
        <button
          onClick={() => handleDemoTypeChange("complex")}
          style={{
            backgroundColor: demoType === "complex" ? "#4f46e5" : undefined,
            color: demoType === "complex" ? "white" : undefined,
            padding: "5px 10px",
            marginRight: "10px",
          }}
        >
          Complex Project
        </button>
        <button
          onClick={() => handleDemoTypeChange("yearLong")}
          style={{
            backgroundColor: demoType === "yearLong" ? "#4f46e5" : undefined,
            color: demoType === "yearLong" ? "white" : undefined,
            padding: "5px 10px",
            marginRight: "10px",
          }}
        >
          Year-Long Project
        </button>
        <button
          onClick={() => handleDemoTypeChange("hourly")}
          style={{
            backgroundColor: demoType === "hourly" ? "#4f46e5" : undefined,
            color: demoType === "hourly" ? "white" : undefined,
            padding: "5px 10px",
          }}
        >
          Hourly Schedule
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>
          This demo showcases different view modes (Minute, Hour, Day, Week,
          Month, Quarter, Year).
          {demoType === "hourly" &&
            " 🕐 Try the Hour view to see hourly tasks with precise time tracking and drag the progress handles!"}
          {demoType === "complex" &&
            " 📊 Use the progress bar handles to adjust task completion percentage."}
          {demoType === "yearLong" &&
            " 📅 Perfect for viewing long-term projects across the year."}
        </p>
      </div>

      <GanttChart
        tasks={tasks}
        title={
          demoType === "complex"
            ? "Complex Project"
            : demoType === "yearLong"
              ? "Year-Long Project"
              : "Today's Schedule"
        }
        darkMode={darkMode}
        showProgress={true}
        viewMode={viewMode}
        focusMode={true}
        viewModes={[
          ViewMode.MINUTE,
          ViewMode.HOUR,
          ViewMode.DAY,
          ViewMode.WEEK,
          ViewMode.MONTH,
          ViewMode.QUARTER,
          ViewMode.YEAR,
        ]}
        startDate={
          demoType === "hourly"
            ? (() => {
                const start = new Date();
                start.setHours(8, 0, 0, 0);
                return start;
              })()
            : undefined
        }
        endDate={
          demoType === "hourly"
            ? (() => {
                const end = new Date();
                end.setHours(19, 0, 0, 0);
                return end;
              })()
            : undefined
        }
        onViewModeChange={handleViewModeChange}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
};

export default DemoViewModes;
