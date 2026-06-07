import { ViewMode } from "@/types";
import {
  addMinutes,
  addHours,
  addDays,
  addQuarters,
  addYears,
  startOfQuarter,
  startOfYear,
} from "date-fns";

/**
 * TimeScale — the single source of truth for mapping between dates and pixels.
 *
 * The whole Gantt grid is laid out as a row of fixed-width columns (one per
 * time unit, each `unitWidth` px). A date is positioned by finding the column
 * it falls in and interpolating *within* that column by the fraction of the
 * column's real duration that has elapsed. Because the header renders the exact
 * same columns at the exact same widths, bars and header always line up — there
 * is no drift between months of different lengths, leap years, etc.
 *
 * `dateToX` and `xToDate` are exact inverses (modulo clamping at the edges), so
 * dragging a task and reading its new dates back is perfectly stable: a task can
 * never silently gain or lose duration through a move.
 */
export class TimeScale {
  readonly viewMode: ViewMode;
  readonly unitWidth: number;
  readonly minuteStep: number;
  /** Column start dates — one per visible time unit. */
  readonly units: Date[];
  /** Cached unit start times in ms for fast lookup. */
  private readonly unitTimes: number[];
  readonly totalWidth: number;

  constructor(
    viewMode: ViewMode,
    startDate: Date,
    endDate: Date,
    unitWidth: number,
    minuteStep = 5,
    precomputedUnits?: Date[],
  ) {
    this.viewMode = viewMode;
    this.unitWidth = unitWidth;
    this.minuteStep = minuteStep;
    this.units =
      precomputedUnits ??
      buildTimeUnits(viewMode, startDate, endDate, minuteStep);
    this.unitTimes = this.units.map((d) => d.getTime());
    this.totalWidth = this.units.length * unitWidth;
  }

  /** Real duration (ms) of column `i`, derived from neighbouring boundaries. */
  private columnDurationMs(i: number): number {
    const n = this.units.length;
    if (n === 0) return 0;
    if (i < n - 1) return this.unitTimes[i + 1] - this.unitTimes[i];
    // Last column: fall back to the nominal unit length.
    return (
      addUnits(this.units[i], this.viewMode, 1, this.minuteStep).getTime() -
      this.unitTimes[i]
    );
  }

  /** Find the column index whose span contains time `t` (clamped to range). */
  private columnIndexAt(t: number): number {
    const n = this.unitTimes.length;
    if (n === 0) return 0;
    if (t <= this.unitTimes[0]) return 0;
    if (t >= this.unitTimes[n - 1]) return n - 1;
    let lo = 0;
    let hi = n - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (this.unitTimes[mid] <= t) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  }

  /** Map a date to an x pixel offset, clamped to [0, totalWidth]. */
  dateToX(date: Date): number {
    const n = this.units.length;
    if (n === 0) return 0;
    const t = date instanceof Date ? date.getTime() : new Date(date).getTime();
    if (isNaN(t)) return 0;

    if (t <= this.unitTimes[0]) return 0;
    const lastDur = this.columnDurationMs(n - 1);
    const end = this.unitTimes[n - 1] + lastDur;
    if (t >= end) return this.totalWidth;

    const i = this.columnIndexAt(t);
    const dur = this.columnDurationMs(i) || 1;
    const frac = (t - this.unitTimes[i]) / dur;
    return (i + frac) * this.unitWidth;
  }

  /** Inverse of {@link dateToX}: map an x pixel offset back to a date. */
  xToDate(x: number): Date {
    const n = this.units.length;
    if (n === 0) return new Date();
    const clamped = Math.max(0, Math.min(this.totalWidth, x));
    let i = Math.floor(clamped / this.unitWidth);
    if (i >= n) i = n - 1;
    if (i < 0) i = 0;
    const frac = (clamped - i * this.unitWidth) / this.unitWidth;
    return new Date(this.unitTimes[i] + frac * this.columnDurationMs(i));
  }

  /** Pixel left/width for a task, clamped to the visible range. */
  positionTask(
    taskStart: Date,
    taskEnd: Date,
    minWidth = 20,
  ): { leftPx: number; widthPx: number } {
    const leftPx = this.dateToX(taskStart);
    const rightPx = this.dateToX(taskEnd);
    let widthPx = Math.max(minWidth, rightPx - leftPx);
    widthPx = Math.min(widthPx, Math.max(minWidth, this.totalWidth - leftPx));
    return { leftPx, widthPx };
  }

  /** Index of the column containing `date`, or -1 if outside the range. */
  currentUnitIndex(date: Date = new Date()): number {
    const n = this.units.length;
    if (n === 0) return -1;
    const t = date.getTime();
    const lastDur = this.columnDurationMs(n - 1);
    if (t < this.unitTimes[0] || t >= this.unitTimes[n - 1] + lastDur) {
      return -1;
    }
    return this.columnIndexAt(t);
  }
}

// ── Unit grid snapping (works in date-space, independent of pixels) ──────────
// MONTH / QUARTER / YEAR views snap to day precision, matching the historical
// behaviour where coarse views stored clean whole-day task ranges.

/** Smallest editable unit (ms) for a view mode. */
export function unitMs(viewMode: ViewMode, minuteStep = 5): number {
  const minute = 60 * 1000;
  switch (viewMode) {
    case ViewMode.MINUTE:
      return minuteStep * minute;
    case ViewMode.HOUR:
      return 60 * minute;
    case ViewMode.WEEK:
      return 7 * 24 * 60 * minute;
    case ViewMode.DAY:
    case ViewMode.MONTH:
    case ViewMode.QUARTER:
    case ViewMode.YEAR:
    default:
      return 24 * 60 * minute;
  }
}

/** Snap a date down to the start of its editing unit. */
export function snapStart(
  date: Date,
  viewMode: ViewMode,
  minuteStep = 5,
): Date {
  const d = new Date(date);
  switch (viewMode) {
    case ViewMode.MINUTE: {
      const m = Math.floor(d.getMinutes() / minuteStep) * minuteStep;
      d.setMinutes(m, 0, 0);
      return d;
    }
    case ViewMode.HOUR:
      d.setMinutes(0, 0, 0);
      return d;
    default:
      d.setHours(0, 0, 0, 0);
      return d;
  }
}

/** Snap a date up to the inclusive end of its editing unit. */
export function snapEnd(date: Date, viewMode: ViewMode, minuteStep = 5): Date {
  const d = new Date(date);
  switch (viewMode) {
    case ViewMode.MINUTE: {
      const m = Math.floor(d.getMinutes() / minuteStep) * minuteStep;
      d.setMinutes(m + minuteStep - 1, 59, 999);
      return d;
    }
    case ViewMode.HOUR:
      d.setMinutes(59, 59, 999);
      return d;
    default:
      d.setHours(23, 59, 59, 999);
      return d;
  }
}

/** Shift a date by a whole number of editing units (used for moves). */
export function shiftByUnits(
  date: Date,
  viewMode: ViewMode,
  amount: number,
  minuteStep = 5,
): Date {
  switch (viewMode) {
    case ViewMode.MINUTE:
      return addMinutes(date, amount * minuteStep);
    case ViewMode.HOUR:
      return addHours(date, amount);
    case ViewMode.WEEK:
      return addDays(date, amount * 7);
    case ViewMode.DAY:
    case ViewMode.MONTH:
    case ViewMode.QUARTER:
    case ViewMode.YEAR:
    default:
      return addDays(date, amount);
  }
}

// ── Timeline construction & extension ────────────────────────────────────────

/** How many units to grow the timeline by when infinite-scroll extends it. */
export function getExtensionAmount(viewMode: ViewMode): number {
  switch (viewMode) {
    case ViewMode.MINUTE:
      return 60;
    case ViewMode.HOUR:
      return 24;
    case ViewMode.DAY:
      return 7;
    case ViewMode.WEEK:
      return 4;
    case ViewMode.MONTH:
      return 3;
    case ViewMode.QUARTER:
      return 4;
    case ViewMode.YEAR:
      return 5;
    default:
      return 3;
  }
}

/** Add `amount` units of `viewMode` to a date. */
export function addUnits(
  date: Date,
  viewMode: ViewMode,
  amount: number,
  minuteStep = 5,
): Date {
  switch (viewMode) {
    case ViewMode.MINUTE:
      return addMinutes(date, amount * minuteStep);
    case ViewMode.HOUR:
      return addHours(date, amount);
    case ViewMode.DAY:
      return addDays(date, amount);
    case ViewMode.WEEK:
      return addDays(date, amount * 7);
    case ViewMode.MONTH:
      return new Date(
        date.getFullYear(),
        date.getMonth() + amount,
        date.getDate(),
      );
    case ViewMode.QUARTER:
      return addQuarters(date, amount);
    case ViewMode.YEAR:
      return addYears(date, amount);
    default:
      return date;
  }
}

/** Default pixel width per unit for a view mode. */
export function defaultUnitWidth(viewMode: ViewMode): number {
  switch (viewMode) {
    case ViewMode.MINUTE:
      return 60;
    case ViewMode.HOUR:
      return 80;
    case ViewMode.DAY:
      return 50;
    case ViewMode.WEEK:
      return 80;
    case ViewMode.MONTH:
      return 150;
    case ViewMode.QUARTER:
      return 180;
    case ViewMode.YEAR:
      return 200;
    default:
      return 150;
  }
}

/**
 * Build the ordered list of column-start dates for a view mode. Mirrors the
 * historical timeline generation so headers and "today" highlighting are
 * unchanged, but lives in one place now.
 */
export function buildTimeUnits(
  viewMode: ViewMode,
  start: Date,
  end: Date,
  minuteStep = 5,
): Date[] {
  if (
    !(start instanceof Date) ||
    !(end instanceof Date) ||
    isNaN(start.getTime()) ||
    isNaN(end.getTime())
  ) {
    return [];
  }

  switch (viewMode) {
    case ViewMode.MINUTE:
      return buildMinutes(start, end, minuteStep);
    case ViewMode.HOUR:
      return buildHours(start, end);
    case ViewMode.DAY:
      return buildDays(start, end);
    case ViewMode.WEEK:
      return buildWeeks(start, end);
    case ViewMode.MONTH:
      return buildMonths(start, end);
    case ViewMode.QUARTER:
      return buildQuarters(start, end);
    case ViewMode.YEAR:
      return buildYears(start, end);
    default:
      return buildMonths(start, end);
  }
}

function buildMinutes(start: Date, end: Date, step: number): Date[] {
  const out: Date[] = [];
  const cur = new Date(start);
  cur.setSeconds(0, 0);
  cur.setMinutes(Math.floor(cur.getMinutes() / step) * step);

  const endAdj = new Date(end);
  endAdj.setSeconds(59, 999);

  // Cap at 500 intervals to keep the minute view responsive.
  const maxIntervals = 500;
  let count = 0;
  while (cur <= endAdj && count < maxIntervals) {
    out.push(new Date(cur));
    cur.setMinutes(cur.getMinutes() + step);
    count++;
  }
  return out;
}

function buildHours(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const cur = new Date(start);
  cur.setMinutes(0, 0, 0);
  const endAdj = new Date(end);
  endAdj.setMinutes(59, 59, 999);
  while (cur <= endAdj) {
    out.push(new Date(cur));
    cur.setHours(cur.getHours() + 1);
  }
  return out;
}

function buildDays(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endAdj = new Date(end);
  endAdj.setHours(23, 59, 59, 999);
  while (cur <= endAdj) {
    out.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

function buildWeeks(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    out.push(new Date(cur));
    cur.setDate(cur.getDate() + 7);
  }
  return out;
}

function buildMonths(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();
  for (let y = startYear; y <= endYear; y++) {
    const mStart = y === startYear ? startMonth : 0;
    const mEnd = y === endYear ? endMonth : 11;
    for (let m = mStart; m <= mEnd; m++) {
      out.push(new Date(y, m, 1));
    }
  }
  return out;
}

function buildQuarters(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const cur = startOfQuarter(new Date(start));
  while (cur <= end) {
    out.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 3);
  }
  return out;
}

function buildYears(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const cur = startOfYear(new Date(start));
  while (cur <= end) {
    out.push(new Date(cur));
    cur.setFullYear(cur.getFullYear() + 1);
  }
  return out;
}
