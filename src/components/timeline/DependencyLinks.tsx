import React, { useMemo } from "react";
import { TaskGroup, ViewMode, DependencyLink } from "@/types";
import { TaskService } from "@/services/TaskService";
import { CollisionService } from "@/services/CollisionService";

interface TaskPosition {
  leftPx: number;
  rightPx: number;
  centerY: number;
}

export interface DependencyLinksProps {
  tasks: TaskGroup[];
  startDate: Date;
  endDate: Date;
  totalUnits: number;
  unitWidth: number;
  viewMode: ViewMode;
  /** Additional links to render on top of any task.dependencies[] already set. */
  extraLinks?: DependencyLink[];
}

// Links are only drawn when the horizontal gap between the source's right
// edge and the target's left edge exceeds this threshold. Below this the
// dependency is visually obvious from adjacency alone.
const MIN_LINK_GAP_PX = 24;

type Point = [number, number];

/**
 * Turns a list of corner points into an SVG path with rounded corners.
 * Zero-length segments are skipped so collinear points don't create artifacts.
 */
function roundedPath(rawPoints: Point[], radius: number): string {
  // Drop consecutive duplicate points to avoid NaN from zero-length segments
  const pts: Point[] = [];
  for (const p of rawPoints) {
    const last = pts[pts.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) pts.push(p);
  }

  if (pts.length < 2) return "";
  if (pts.length === 2) {
    return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  }

  let d = `M${pts[0][0]},${pts[0][1]}`;

  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];

    const v1x = cx - px;
    const v1y = cy - py;
    const v2x = nx - cx;
    const v2y = ny - cy;
    const len1 = Math.hypot(v1x, v1y);
    const len2 = Math.hypot(v2x, v2y);
    const r = Math.min(radius, len1 / 2, len2 / 2);

    const bx = cx - (v1x / len1) * r;
    const by = cy - (v1y / len1) * r;
    const ax = cx + (v2x / len2) * r;
    const ay = cy + (v2y / len2) * r;

    d += ` L${bx},${by} Q${cx},${cy} ${ax},${ay}`;
  }

  const last = pts[pts.length - 1];
  d += ` L${last[0]},${last[1]}`;
  return d;
}

/**
 * Builds a clean orthogonal dependency path with rounded corners.
 *
 * Strategy:
 *  - Same row, forward → straight horizontal (no bends needed)
 *  - Different row, forward → one L-bend centered in the gap between tasks
 *  - Backward / tight → two stubs + one horizontal bridge routed below the row
 */
function buildPath(x1: number, y1: number, x2: number, y2: number): string {
  const STUB = 10; // short exit/entry stub
  const RADIUS = 5; // corner rounding
  const TASK_HALF_H = 16; // half task height — used for below-row routing

  const sameRow = Math.abs(y2 - y1) < 2;
  const gap = x2 - x1; // positive = forward

  // ── Same row, forward ────────────────────────────────────────────────────
  if (sameRow && gap >= MIN_LINK_GAP_PX) {
    return `M${x1},${y1} L${x2},${y2}`;
  }

  // ── Different rows, forward (enough room for one bend) ───────────────────
  if (!sameRow && gap >= STUB * 2) {
    // Place the vertical segment at the midpoint of the gap so neither end
    // gets a long horizontal run — results in balanced, readable elbows.
    const turnX = x1 + gap / 2;
    return roundedPath(
      [
        [x1, y1],
        [turnX, y1],
        [turnX, y2],
        [x2, y2],
      ],
      RADIUS,
    );
  }

  // ── Backward / tight: route below the task row ───────────────────────────
  // Exit right of source, drop below the row, travel horizontally, rise and
  // enter left of target. This keeps the detour compact and below the bars.
  const belowY = Math.max(y1, y2) + TASK_HALF_H + 10;
  const rx = x1 + STUB;
  const lx = x2 - STUB;

  return roundedPath(
    [
      [x1, y1],
      [rx, y1],
      [rx, belowY],
      [lx, belowY],
      [lx, y2],
      [x2, y2],
    ],
    RADIUS,
  );
}

/**
 * Renders SVG arrows connecting dependent tasks across the entire Gantt grid.
 * Enable with <GanttChart showDependencyLinks /> — off by default.
 */
const DependencyLinks: React.FC<DependencyLinksProps> = ({
  tasks,
  startDate,
  endDate,
  totalUnits,
  unitWidth,
  viewMode,
  extraLinks = [],
}) => {
  const links = useMemo(() => {
    // 1. Build a position map: taskId → pixel coords
    const positions = new Map<string, TaskPosition>();
    let cumulativeY = 0;

    tasks.forEach((group) => {
      if (!group || !Array.isArray(group.tasks)) {
        cumulativeY += 60;
        return;
      }

      const taskRows =
        group.tasks.length > 0
          ? CollisionService.detectOverlaps(group.tasks, viewMode)
          : [];
      const rowHeight = Math.max(60, taskRows.length * 40 + 20);

      taskRows.forEach((rowTasks, rowIndex) => {
        rowTasks.forEach((task) => {
          try {
            const { leftPx, widthPx } = TaskService.calculateTaskPixelPosition(
              task,
              startDate,
              endDate,
              totalUnits,
              unitWidth,
              viewMode,
            );
            const topPx = rowIndex * 40 + 10;
            const centerY = cumulativeY + topPx + 16; // half of 32px task height

            positions.set(task.id, {
              leftPx,
              rightPx: leftPx + widthPx,
              centerY,
            });
          } catch {
            // skip invalid tasks
          }
        });
      });

      cumulativeY += rowHeight;
    });

    // 2. Merge dependency pairs from both sources into a dedup set.
    //    Source A: task.dependencies[] (legacy, embedded in task data)
    //    Source B: extraLinks prop (explicit or auto-derived by GanttChart)
    const pairSet = new Set<string>();
    const pairs: Array<{ from: string; to: string }> = [];

    const addPair = (from: string, to: string) => {
      const key = `${from}->${to}`;
      if (pairSet.has(key)) return;
      pairSet.add(key);
      pairs.push({ from, to });
    };

    tasks.forEach((group) => {
      if (!group || !Array.isArray(group.tasks)) return;
      group.tasks.forEach((task) => {
        task.dependencies?.forEach((depId) => addPair(depId, task.id));
      });
    });

    extraLinks.forEach(({ from, to }) => addPair(from, to));

    // 3. Build SVG paths for each valid pair.
    const arrows: { d: string; id: string }[] = [];

    pairs.forEach(({ from, to }) => {
      const fromPos = positions.get(from);
      const toPos = positions.get(to);
      if (!fromPos || !toPos) return;

      // Skip links when tasks are directly adjacent — visually redundant.
      const gap = toPos.leftPx - fromPos.rightPx;
      if (gap < MIN_LINK_GAP_PX) return;

      const d = buildPath(
        fromPos.rightPx,
        fromPos.centerY,
        toPos.leftPx,
        toPos.centerY,
      );
      if (d) arrows.push({ d, id: `${from}->${to}` });
    });

    return arrows;
  }, [tasks, startDate, endDate, totalUnits, unitWidth, viewMode, extraLinks]);

  if (links.length === 0) return null;

  return (
    <svg
      className="rmg-dependency-links"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${totalUnits * unitWidth}px`,
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        // Stay below task bars (z-index: 1) so lines are never drawn on top of
        // a task. They remain visible in the gaps between rows.
        zIndex: 0,
      }}
    >
      <defs>
        <marker
          id="rmg-dep-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path
            d="M0,0 L0,6 L7,3 z"
            fill="var(--rmg-dependency-color, var(--rmg-indigo-500, #6366f1))"
          />
        </marker>
      </defs>

      {links.map(({ d, id }) => (
        <path
          key={id}
          d={d}
          className="rmg-dependency-link"
          stroke="var(--rmg-dependency-color, var(--rmg-indigo-500, #6366f1))"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#rmg-dep-arrow)"
          opacity="0.75"
        />
      ))}
    </svg>
  );
};

DependencyLinks.displayName = "DependencyLinks";

export default DependencyLinks;
