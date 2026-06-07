import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  GanttChartProps,
  ViewMode,
  TaskGroup,
  Task,
  GanttChartRef,
  ExportOptions,
  ExportResult,
  ExportFormat,
  DependencyLink,
} from "@/types";
import { findEarliestDate, findLatestDate } from "@/utils";
import { Timeline, TodayMarker, DependencyLinks } from "@/components/timeline";
import { ViewModeSelector } from "@/components/ui";
import { TaskRow, TaskList } from "@/components/task";
import { ExportService } from "@/services/ExportService";
import { CollisionService } from "@/services/CollisionService";
import {
  TimeScale,
  addUnits,
  getExtensionAmount,
  defaultUnitWidth,
} from "@/core";

/**
 * GanttChart — a modern, customizable Gantt chart for project timelines.
 *
 * A single {@link TimeScale} drives the header, the task bars, the today marker
 * and dependency arrows, so everything stays pixel-consistent across view modes.
 */
const GanttChart = forwardRef<GanttChartRef, GanttChartProps>(
  (
    {
      tasks = [],
      startDate: customStartDate,
      endDate: customEndDate,
      title = "Project Timeline",
      currentDate = new Date(),
      showCurrentDateMarker = true,
      todayLabel = "Today",
      editMode = true,
      allowProgressEdit = true,
      allowTaskResize = true,
      allowTaskMove = true,
      headerLabel = "Resources",
      showProgress = false,
      darkMode = false,
      locale = "default",
      styles = {},
      viewMode = ViewMode.MONTH,
      viewModes,
      showTimelineHeader = true,
      smoothDragging = true,
      movementThreshold = 3,
      animationSpeed = 0.25,
      minuteStep = 5,
      infiniteScroll = false,
      onTimelineExtend,
      focusMode = true,
      showDependencyLinks = false,
      dependencyLinks,

      // Custom rendering functions
      renderTaskList,
      renderTask,
      renderTooltip,
      renderViewModeSelector,
      renderHeader,
      renderTimelineHeader,
      getTaskColor,

      // Event handlers
      onTaskUpdate,
      onTaskClick,
      onTaskSelect,
      onTaskDoubleClick,
      onGroupClick,
      onViewModeChange,

      // Visual customization
      fontSize,
      rowHeight = 40,
      timeStep,
      maxHeight,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [activeViewMode, setActiveViewMode] = useState<ViewMode>(viewMode);
    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
    const [viewUnitWidth, setViewUnitWidth] = useState<number>(
      defaultUnitWidth(viewMode),
    );
    const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);

    // Calculate timeline bounds
    const derivedStartDate = customStartDate || findEarliestDate(tasks);
    const derivedEndDate = customEndDate || findLatestDate(tasks);

    // The single coordinate system shared by every sub-component.
    const scale = useMemo(
      () =>
        new TimeScale(
          activeViewMode,
          derivedStartDate,
          derivedEndDate,
          viewUnitWidth,
          minuteStep,
        ),
      [
        activeViewMode,
        derivedStartDate.getTime(),
        derivedEndDate.getTime(),
        viewUnitWidth,
        minuteStep,
      ],
    );

    const timeUnits = scale.units;
    const totalUnits = timeUnits.length;
    const currentUnitIndex = scale.currentUnitIndex(new Date());

    // --- Infinite scroll bookkeeping ---
    const isExtendingRef = useRef<boolean>(false);
    const pendingLeftExtendRef = useRef<{
      prevScrollWidth: number;
      prevScrollLeft: number;
    } | null>(null);
    const extendStateRef = useRef({
      startDate: derivedStartDate,
      endDate: derivedEndDate,
      viewMode: activeViewMode,
    });
    extendStateRef.current = {
      startDate: derivedStartDate,
      endDate: derivedEndDate,
      viewMode: activeViewMode,
    };

    // Expose export / scroll methods via ref
    useImperativeHandle(
      ref,
      () => ({
        exportChart: async (options?: ExportOptions): Promise<ExportResult> => {
          if (!containerRef.current) {
            return { success: false, error: "Container element not available" };
          }
          return ExportService.export(containerRef.current, {
            ...options,
            backgroundColor: darkMode
              ? "#1f2937"
              : options?.backgroundColor || "#ffffff",
          });
        },

        getDataUrl: async (
          format?: ExportFormat,
          options?: Omit<ExportOptions, "format" | "filename">,
        ): Promise<string | null> => {
          if (!containerRef.current) return null;
          return ExportService.getDataUrl(containerRef.current, format, {
            ...options,
            backgroundColor: darkMode
              ? "#1f2937"
              : options?.backgroundColor || "#ffffff",
          });
        },

        getBlob: async (
          format?: ExportFormat,
          options?: Omit<ExportOptions, "format" | "filename">,
        ): Promise<Blob | null> => {
          if (!containerRef.current) return null;
          return ExportService.getBlob(containerRef.current, format, {
            ...options,
            backgroundColor: darkMode
              ? "#1f2937"
              : options?.backgroundColor || "#ffffff",
          });
        },

        copyToClipboard: async (
          options?: Omit<ExportOptions, "format" | "filename">,
        ): Promise<boolean> => {
          if (!containerRef.current) return false;
          return ExportService.copyToClipboard(containerRef.current, {
            ...options,
            backgroundColor: darkMode
              ? "#1f2937"
              : options?.backgroundColor || "#ffffff",
          });
        },

        getContainerElement: (): HTMLDivElement | null => containerRef.current,

        scrollToDate: (date: Date): void => {
          if (!scrollContainerRef.current) return;
          const x = scale.dateToX(date);
          scrollContainerRef.current.scrollLeft =
            x - scrollContainerRef.current.clientWidth / 2;
        },

        scrollToToday: (): void => {
          scrollToNow(activeViewMode, viewUnitWidth);
        },
      }),
      [darkMode, scale, activeViewMode, viewUnitWidth],
    );

    // Infinite scroll: extend the timeline by a chunk of units in a direction.
    const handleTimelineExtension = (direction: "left" | "right") => {
      if (!infiniteScroll || !onTimelineExtend) return;

      const {
        startDate: curStart,
        endDate: curEnd,
        viewMode: curMode,
      } = extendStateRef.current;

      const amount = getExtensionAmount(curMode);
      const newStartDate =
        direction === "left"
          ? addUnits(curStart, curMode, -amount, minuteStep)
          : curStart;
      const newEndDate =
        direction === "right"
          ? addUnits(curEnd, curMode, amount, minuteStep)
          : curEnd;

      onTimelineExtend(direction, newStartDate, newEndDate);
    };

    // Get available view modes based on props
    const getAvailableViewModes = (): ViewMode[] | false => {
      if (viewModes === false) return false;
      if (Array.isArray(viewModes)) return viewModes;
      return [
        ViewMode.DAY,
        ViewMode.WEEK,
        ViewMode.MONTH,
        ViewMode.QUARTER,
        ViewMode.YEAR,
      ];
    };

    // Handle auto-scrolling state
    const handleAutoScrollingChange = (isScrolling: boolean) => {
      setIsAutoScrolling(isScrolling);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.classList.toggle(
          "rmg-auto-scrolling",
          isScrolling,
        );
      }
    };

    // Task interaction handlers
    const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
      if (!onTaskUpdate) return;
      try {
        const ensuredTask = {
          ...updatedTask,
          startDate:
            updatedTask.startDate instanceof Date
              ? updatedTask.startDate
              : new Date(updatedTask.startDate),
          endDate:
            updatedTask.endDate instanceof Date
              ? updatedTask.endDate
              : new Date(updatedTask.endDate),
        };
        onTaskUpdate(groupId, ensuredTask);
      } catch (error) {
        console.error("Error in handleTaskUpdate:", error);
      }
    };

    const handleTaskClick = (task: Task, group: TaskGroup) => {
      try {
        onTaskClick?.(task, group);
      } catch (error) {
        console.error("Error in handleTaskClick:", error);
      }
    };

    const handleTaskSelect = (task: Task, isSelected: boolean) => {
      setSelectedTaskIds((prev) =>
        isSelected ? [...prev, task.id] : prev.filter((id) => id !== task.id),
      );
      try {
        onTaskSelect?.(task, isSelected);
      } catch (error) {
        console.error("Error in onTaskSelect handler:", error);
      }
    };

    // Smooth-scroll so "now" is centered in the viewport.
    const scrollToNow = (mode: ViewMode, unitWidth: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const targetScale = new TimeScale(
        mode,
        derivedStartDate,
        derivedEndDate,
        unitWidth,
        minuteStep,
      );
      const nowX = targetScale.dateToX(new Date());
      const maxScroll = targetScale.totalWidth - container.clientWidth;
      const target = Math.max(
        0,
        Math.min(maxScroll, nowX - container.clientWidth / 2),
      );

      container.style.scrollBehavior = "smooth";
      container.scrollLeft = target;
      setTimeout(() => {
        if (container) container.style.scrollBehavior = "";
      }, 500);
    };

    const handleViewModeChange = (newMode: ViewMode) => {
      const newUnitWidth = defaultUnitWidth(newMode);
      setActiveViewMode(newMode);
      setViewUnitWidth(newUnitWidth);
      onViewModeChange?.(newMode);

      if (focusMode) {
        requestAnimationFrame(() => {
          setTimeout(() => scrollToNow(newMode, newUnitWidth), 100);
        });
      }
    };

    // Initialize view mode when the prop changes
    useEffect(() => {
      handleViewModeChange(viewMode);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode]);

    // Scroll to "now" when focus mode is initially enabled
    useEffect(() => {
      if (focusMode && scrollContainerRef.current) {
        const timeoutId = setTimeout(
          () => scrollToNow(activeViewMode, viewUnitWidth),
          300,
        );
        return () => clearTimeout(timeoutId);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusMode]);

    // Apply custom animation speed to CSS variables
    useEffect(() => {
      if (containerRef.current) {
        const speedValue = Math.max(0.1, Math.min(1, animationSpeed || 0.25));
        containerRef.current.style.setProperty(
          "--rmg-animation-speed",
          speedValue.toString(),
        );
      }
    }, [animationSpeed]);

    // Sticky headers: translate timeline headers and task-list header on scroll
    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const handleScroll = () => {
        const scrollTop = scrollContainer.scrollTop;
        const higherHeaders = scrollContainer.querySelectorAll<HTMLElement>(
          ".rmg-timeline-header-higher",
        );
        const mainHeaders = scrollContainer.querySelectorAll<HTMLElement>(
          ".rmg-timeline-header",
        );
        const taskListHeader = scrollContainer.querySelector<HTMLElement>(
          ".rmg-task-list-header",
        );
        const todayMarkerLabel = scrollContainer.querySelector<HTMLElement>(
          ".rmg-today-marker-label",
        );

        higherHeaders.forEach((el) => {
          el.style.transform = `translateY(${scrollTop}px)`;
        });
        mainHeaders.forEach((el) => {
          el.style.transform = `translateY(${scrollTop}px)`;
        });
        if (taskListHeader) {
          taskListHeader.style.transform = `translateY(${scrollTop}px)`;
        }
        if (todayMarkerLabel) {
          todayMarkerLabel.style.transform = `translate(-50%, ${scrollTop}px)`;
        }
      };

      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }, []);

    // Infinite scroll: proactively extend the timeline before reaching an edge.
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container || !infiniteScroll || !onTimelineExtend) return;

      let rafId = 0;

      const checkExtend = () => {
        rafId = 0;
        if (isExtendingRef.current) return;

        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll <= 0) return;

        const threshold = Math.max(200, container.clientWidth * 0.75);

        if (container.scrollLeft >= maxScroll - threshold) {
          isExtendingRef.current = true;
          handleTimelineExtension("right");
        } else if (container.scrollLeft <= threshold) {
          isExtendingRef.current = true;
          pendingLeftExtendRef.current = {
            prevScrollWidth: container.scrollWidth,
            prevScrollLeft: container.scrollLeft,
          };
          handleTimelineExtension("left");
        }

        if (isExtendingRef.current) {
          window.setTimeout(() => {
            isExtendingRef.current = false;
            pendingLeftExtendRef.current = null;
          }, 500);
        }
      };

      const onScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(checkExtend);
      };

      container.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", onScroll);
        if (rafId) cancelAnimationFrame(rafId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [infiniteScroll, onTimelineExtend]);

    // After a left extension the timeline grows on the left; compensate the
    // scroll position so the viewport stays put. Runs before paint.
    useLayoutEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (pendingLeftExtendRef.current) {
        const { prevScrollWidth, prevScrollLeft } =
          pendingLeftExtendRef.current;
        const delta = container.scrollWidth - prevScrollWidth;
        if (delta !== 0) container.scrollLeft = prevScrollLeft + delta;
        pendingLeftExtendRef.current = null;
      }

      isExtendingRef.current = false;
    }, [totalUnits]);

    // Resolve the effective extra dependency links to pass to DependencyLinks.
    const resolvedExtraLinks: DependencyLink[] = useMemo(() => {
      if (!dependencyLinks) return [];
      if (dependencyLinks === "auto") {
        const links: DependencyLink[] = [];
        tasks.forEach((group) => {
          if (!group || !Array.isArray(group.tasks) || group.tasks.length < 2)
            return;
          const sorted = [...group.tasks].sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          );
          for (let i = 0; i < sorted.length - 1; i++) {
            links.push({ from: sorted[i].id, to: sorted[i + 1].id });
          }
        });
        return links;
      }
      return dependencyLinks;
    }, [dependencyLinks, tasks]);

    // Total grid height (used by the today marker), computed once per render.
    const totalGridHeight = useMemo(
      () =>
        tasks.reduce((total, group) => {
          if (!group || !Array.isArray(group.tasks)) return total + 60;
          const taskRows = CollisionService.detectOverlaps(
            group.tasks,
            activeViewMode,
          );
          return total + Math.max(60, taskRows.length * 40 + 20);
        }, 0),
      [tasks, activeViewMode],
    );

    const style: React.CSSProperties = { fontSize: fontSize || "inherit" };
    const themeClass = darkMode ? "rmg-dark" : "";

    const getComponentClassName = (component: string, defaultClass: string) =>
      `${defaultClass} ${styles[component as keyof typeof styles] || ""}`;

    const shouldShowViewModeSelector = getAvailableViewModes() !== false;

    const renderHeaderContent = () => {
      if (renderHeader) {
        return renderHeader({
          title,
          darkMode,
          viewMode: activeViewMode,
          onViewModeChange: handleViewModeChange,
          showViewModeSelector: shouldShowViewModeSelector,
        });
      }

      return (
        <div className="rmg-header">
          <div className="rmg-header-content">
            <h1 className={getComponentClassName("title", "rmg-title")}>
              {title}
            </h1>

            {shouldShowViewModeSelector && (
              <div className="rmg-view-mode-wrapper">
                {renderViewModeSelector ? (
                  renderViewModeSelector({
                    activeMode: activeViewMode,
                    onChange: handleViewModeChange,
                    darkMode,
                    availableModes: getAvailableViewModes() as ViewMode[],
                  })
                ) : (
                  <ViewModeSelector
                    activeMode={activeViewMode}
                    onChange={handleViewModeChange}
                    darkMode={darkMode}
                    availableModes={getAvailableViewModes() as ViewMode[]}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      );
    };

    const renderTimelineHeaderContent = () => {
      if (renderTimelineHeader) {
        return renderTimelineHeader({
          timeUnits,
          currentUnitIndex,
          viewMode: activeViewMode,
          locale,
          unitWidth: viewUnitWidth,
        });
      }

      return (
        <Timeline
          months={timeUnits}
          currentMonthIndex={currentUnitIndex}
          locale={locale}
          className={getComponentClassName("timeline", "rmg-timeline")}
          viewMode={activeViewMode}
          unitWidth={viewUnitWidth}
          showTimelineHeader={showTimelineHeader}
        />
      );
    };

    return (
      <div
        ref={containerRef}
        className={`rmg-gantt-chart ${themeClass} ${getComponentClassName("container", "")}`}
        style={
          {
            ...style,
            "--gantt-unit-width": `${viewUnitWidth}px`,
          } as React.CSSProperties
        }
        data-testid="gantt-chart"
        data-rmg-component="gantt-chart"
        data-view-mode={activeViewMode}
      >
        {renderHeaderContent()}

        <div
          ref={scrollContainerRef}
          className={`rmg-container ${isAutoScrolling ? "rmg-auto-scrolling" : ""}`}
          data-rmg-component="container"
          style={
            maxHeight
              ? {
                  maxHeight:
                    typeof maxHeight === "number"
                      ? `${maxHeight}px`
                      : maxHeight,
                }
              : undefined
          }
        >
          {renderTaskList ? (
            renderTaskList({
              tasks,
              headerLabel,
              onGroupClick,
              viewMode: activeViewMode,
            })
          ) : (
            <TaskList
              tasks={tasks}
              headerLabel={headerLabel}
              onGroupClick={onGroupClick}
              className={getComponentClassName("taskList", "rmg-task-list")}
              viewMode={activeViewMode}
              showTimelineHeader={showTimelineHeader}
            />
          )}

          <div
            className="rmg-timeline-container"
            data-rmg-component="timeline-container"
          >
            <div
              className="rmg-timeline-content"
              data-rmg-component="timeline-content"
            >
              {renderTimelineHeaderContent()}

              <div
                className="rmg-timeline-grid"
                data-rmg-component="timeline-grid"
                data-view-mode={activeViewMode}
              >
                {showCurrentDateMarker && currentUnitIndex >= 0 && (
                  <TodayMarker
                    currentMonthIndex={currentUnitIndex}
                    height={totalGridHeight}
                    label={todayLabel}
                    dayOfMonth={currentDate.getDate()}
                    className={getComponentClassName(
                      "todayMarker",
                      "rmg-today-marker",
                    )}
                    viewMode={activeViewMode}
                    unitWidth={viewUnitWidth}
                  />
                )}

                {tasks.map((group) => {
                  if (!group || !group.id) return null;

                  return (
                    <TaskRow
                      key={`task-row-${group.id}`}
                      taskGroup={group}
                      startDate={derivedStartDate}
                      endDate={derivedEndDate}
                      totalMonths={totalUnits}
                      monthWidth={viewUnitWidth}
                      editMode={editMode}
                      allowProgressEdit={allowProgressEdit}
                      allowTaskResize={allowTaskResize}
                      allowTaskMove={allowTaskMove}
                      showProgress={showProgress}
                      onTaskUpdate={handleTaskUpdate}
                      onTaskClick={handleTaskClick}
                      onTaskSelect={handleTaskSelect}
                      onAutoScrollChange={handleAutoScrollingChange}
                      className={getComponentClassName(
                        "taskRow",
                        "rmg-task-row",
                      )}
                      tooltipClassName={getComponentClassName(
                        "tooltip",
                        "rmg-tooltip",
                      )}
                      viewMode={activeViewMode}
                      minuteStep={minuteStep}
                      scrollContainerRef={scrollContainerRef}
                      smoothDragging={smoothDragging}
                      movementThreshold={movementThreshold}
                      animationSpeed={animationSpeed}
                      infiniteScroll={infiniteScroll}
                      onTimelineExtend={handleTimelineExtension}
                      renderTask={renderTask}
                      renderTooltip={renderTooltip}
                      getTaskColor={getTaskColor}
                    />
                  );
                })}

                {showDependencyLinks && (
                  <DependencyLinks
                    tasks={tasks}
                    startDate={derivedStartDate}
                    endDate={derivedEndDate}
                    totalUnits={totalUnits}
                    unitWidth={viewUnitWidth}
                    viewMode={activeViewMode}
                    extraLinks={resolvedExtraLinks}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

GanttChart.displayName = "GanttChart";

export default GanttChart;
