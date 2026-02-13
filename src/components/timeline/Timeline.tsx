import React from "react";
import { TimelineProps, ViewMode } from "@/types";
import { format, getWeek, isValid } from "date-fns";

/**
 * Timeline Component with hierarchical display for different view modes
 * OPTIMIZED: Uses React.memo for performance in minute/hour views
 */
const Timeline: React.FC<TimelineProps> = React.memo(
  ({
    months,
    currentMonthIndex,
    locale = "default",
    className = "",
    viewMode = ViewMode.MONTH,
    unitWidth = 150,
    showTimelineHeader = true,
  }) => {
    // Get locale object for date-fns
    const getLocale = () => {
      if (locale === "default") return undefined;
      // This would use actual locale imports in a real implementation
      return undefined;
    };

    // Format date based on view mode for the main timeline
    const formatDateHeader = (date: Date): string => {
      if (!(date instanceof Date) || !isValid(date)) return "";

      switch (viewMode) {
        case ViewMode.MINUTE:
          return format(date, "HH:mm", { locale: getLocale() });
        case ViewMode.HOUR:
          return format(date, "HH:00", { locale: getLocale() });
        case ViewMode.DAY:
          return format(date, "d", { locale: getLocale() });
        case ViewMode.WEEK:
          const weekNum = getWeek(date);
          return `W${weekNum}`;
        case ViewMode.MONTH:
          return format(date, "MMM yyyy", { locale: getLocale() });
        case ViewMode.QUARTER:
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          return `Q${quarter} ${date.getFullYear()}`;
        case ViewMode.YEAR:
          return date.getFullYear().toString();
        default:
          return format(date, "MMM yyyy", { locale: getLocale() });
      }
    };

    // Format for the higher-level header (hours/days/months/years)
    const formatHigherLevelHeader = (date: Date): string => {
      if (!(date instanceof Date)) return "";

      switch (viewMode) {
        case ViewMode.MINUTE:
          return format(date, "HH:00", { locale: getLocale() });
        case ViewMode.HOUR:
          return format(date, "MMM d", { locale: getLocale() });
        case ViewMode.DAY:
        case ViewMode.WEEK:
          return format(date, "MMM yyyy", { locale: getLocale() });
        default:
          return "";
      }
    };

    // Get higher-level units for the hierarchical header
    const getHigherLevelUnits = (): { date: Date; span: number }[] => {
      if (
        ![ViewMode.MINUTE, ViewMode.HOUR, ViewMode.DAY, ViewMode.WEEK].includes(
          viewMode,
        ) ||
        months.length === 0
      ) {
        return [];
      }

      const result: { date: Date; span: number }[] = [];

      // For minute view, group by hour
      if (viewMode === ViewMode.MINUTE) {
        let currentHour = new Date(months[0]);
        currentHour.setMinutes(0, 0, 0);
        let currentSpan = 0;

        months.forEach((date) => {
          if (
            date.getHours() === currentHour.getHours() &&
            date.getDate() === currentHour.getDate() &&
            date.getMonth() === currentHour.getMonth() &&
            date.getFullYear() === currentHour.getFullYear()
          ) {
            currentSpan += 1;
          } else {
            result.push({ date: currentHour, span: currentSpan });
            currentHour = new Date(date);
            currentHour.setMinutes(0, 0, 0);
            currentSpan = 1;
          }
        });

        // Add the last group
        if (currentSpan > 0) {
          result.push({ date: currentHour, span: currentSpan });
        }

        return result;
      }

      // For hour view, group by day
      if (viewMode === ViewMode.HOUR) {
        let currentDay = new Date(months[0]);
        currentDay.setHours(0, 0, 0, 0);
        let currentSpan = 0;

        months.forEach((date) => {
          if (
            date.getDate() === currentDay.getDate() &&
            date.getMonth() === currentDay.getMonth() &&
            date.getFullYear() === currentDay.getFullYear()
          ) {
            currentSpan += 1;
          } else {
            result.push({ date: currentDay, span: currentSpan });
            currentDay = new Date(date);
            currentDay.setHours(0, 0, 0, 0);
            currentSpan = 1;
          }
        });

        // Add the last group
        if (currentSpan > 0) {
          result.push({ date: currentDay, span: currentSpan });
        }

        return result;
      }

      // For day/week view, group by month
      // Only show hierarchical header if we span multiple months
      if (months.length < 2) {
        return [];
      }

      let currentMonth = new Date(months[0]);
      let currentSpan = 0;

      months.forEach((date) => {
        if (
          date.getMonth() === currentMonth.getMonth() &&
          date.getFullYear() === currentMonth.getFullYear()
        ) {
          currentSpan += 1;
        } else {
          result.push({ date: currentMonth, span: currentSpan });
          currentMonth = new Date(date);
          currentSpan = 1;
        }
      });

      // Add the last month
      if (currentSpan > 0) {
        result.push({ date: currentMonth, span: currentSpan });
      }

      // Only return if we actually have multiple months
      return result.length > 1 ? result : [];
    };

    // Get whether we need a hierarchical display
    const needsHierarchicalDisplay = [
      ViewMode.MINUTE,
      ViewMode.HOUR,
      ViewMode.DAY,
      ViewMode.WEEK,
    ].includes(viewMode);

    // Get higher-level units for hierarchical display
    const higherLevelUnits = getHigherLevelUnits();

    return (
      <div
        className={`rmg-timeline ${className}`}
        style={
          { "--gantt-unit-width": `${unitWidth}px` } as React.CSSProperties
        }
        data-rmg-component="timeline"
        data-view-mode={viewMode}
      >
        {/* Add data-view-mode attribute */}
        {/* Higher-level header for minutes/hours/days/months/years */}
        {showTimelineHeader &&
          needsHierarchicalDisplay &&
          higherLevelUnits.length > 0 && (
            <div
              className="rmg-timeline-header-higher"
              data-rmg-component="timeline-header-higher"
            >
              {higherLevelUnits.map((item, index) => (
                <div
                  key={`higher-level-${index}`}
                  className="rmg-timeline-unit"
                  style={{ width: `${item.span * unitWidth}px` }}
                  data-timeunit-higher={item.date.toISOString()}
                  data-rmg-component="timeline-unit-higher"
                >
                  {formatHigherLevelHeader(item.date)}
                </div>
              ))}
            </div>
          )}
        {/* Main time unit headers */}
        <div
          className="rmg-timeline-header"
          data-rmg-component="timeline-header"
        >
          {months.map((timeUnit, index) => (
            <div
              key={`timeunit-${index}`}
              className={`rmg-timeline-unit ${index === currentMonthIndex ? "rmg-timeline-unit-current" : ""}`}
              style={{ width: `${unitWidth}px` }}
              data-timeunit={timeUnit.toISOString()}
              data-rmg-component="timeline-unit"
            >
              {formatDateHeader(timeUnit)}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

Timeline.displayName = "Timeline";

export default Timeline;
