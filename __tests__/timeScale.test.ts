import {
  TimeScale,
  buildTimeUnits,
  shiftByUnits,
  snapStart,
  snapEnd,
  addUnits,
} from "../src/core";
import { ViewMode } from "../src/types";

describe("TimeScale", () => {
  describe("header / bar consistency (drift fix)", () => {
    // The whole point of the rework: bar edges must line up with the header
    // columns regardless of month length. With the old linear-ms mapping a
    // task starting on Feb 1 drifted a few pixels away from the Feb column.
    test("a date on a column boundary lands exactly on the column edge", () => {
      const start = new Date(2023, 0, 1); // Jan 1
      const end = new Date(2023, 11, 31); // Dec 31
      const unitWidth = 150;
      const scale = new TimeScale(ViewMode.MONTH, start, end, unitWidth);

      // 12 monthly columns, each 150px wide.
      expect(scale.units.length).toBe(12);

      // Each month-start must sit exactly on its column edge — no drift.
      scale.units.forEach((unit, i) => {
        expect(scale.dateToX(unit)).toBeCloseTo(i * unitWidth, 5);
      });
    });

    test("today marker math agrees with bar positioning within a month", () => {
      const start = new Date(2024, 0, 1);
      const end = new Date(2024, 2, 31);
      const unitWidth = 150;
      const scale = new TimeScale(ViewMode.MONTH, start, end, unitWidth);

      // Feb 2024 has 29 days; the 15th should be ~halfway across the column.
      const feb15 = new Date(2024, 1, 15);
      const x = scale.dateToX(feb15);
      const febColumn = 1 * unitWidth;
      const frac = (x - febColumn) / unitWidth;
      expect(frac).toBeGreaterThan(0.4);
      expect(frac).toBeLessThan(0.55);
    });
  });

  describe("invertibility (stable drags)", () => {
    test("xToDate is the inverse of dateToX across the timeline", () => {
      const start = new Date(2023, 0, 1);
      const end = new Date(2023, 5, 30);
      const scale = new TimeScale(ViewMode.MONTH, start, end, 150);

      for (let x = 0; x <= scale.totalWidth; x += 37) {
        const date = scale.xToDate(x);
        expect(scale.dateToX(date)).toBeCloseTo(x, 3);
      }
    });

    test("day view round-trips dates exactly", () => {
      const start = new Date(2023, 0, 1);
      const end = new Date(2023, 0, 31);
      const scale = new TimeScale(ViewMode.DAY, start, end, 50);

      const d = new Date(2023, 0, 10, 0, 0, 0, 0);
      const x = scale.dateToX(d);
      const back = scale.xToDate(x);
      expect(back.getDate()).toBe(10);
    });
  });

  describe("clamping", () => {
    test("dates outside the range clamp to the edges", () => {
      const start = new Date(2023, 0, 1);
      const end = new Date(2023, 1, 28);
      const scale = new TimeScale(ViewMode.MONTH, start, end, 150);

      expect(scale.dateToX(new Date(2022, 0, 1))).toBe(0);
      expect(scale.dateToX(new Date(2030, 0, 1))).toBe(scale.totalWidth);
    });
  });

  describe("currentUnitIndex", () => {
    test("finds the column for a contained date and -1 otherwise", () => {
      const start = new Date(2023, 0, 1);
      const end = new Date(2023, 2, 31);
      const scale = new TimeScale(ViewMode.MONTH, start, end, 150);

      expect(scale.currentUnitIndex(new Date(2023, 1, 15))).toBe(1);
      expect(scale.currentUnitIndex(new Date(2025, 0, 1))).toBe(-1);
    });
  });
});

describe("snapping and unit shifts", () => {
  test("snapStart/snapEnd produce clean day boundaries in coarse views", () => {
    const d = new Date(2023, 4, 17, 13, 45, 30, 123);
    const s = snapStart(d, ViewMode.MONTH);
    const e = snapEnd(d, ViewMode.MONTH);
    expect(s.getHours()).toBe(0);
    expect(s.getMinutes()).toBe(0);
    expect(e.getHours()).toBe(23);
    expect(e.getMinutes()).toBe(59);
  });

  test("shiftByUnits preserves duration for a move", () => {
    const start = new Date(2023, 0, 10);
    const end = new Date(2023, 0, 20);
    const ns = shiftByUnits(start, ViewMode.MONTH, 5); // +5 days
    const ne = shiftByUnits(end, ViewMode.MONTH, 5);
    expect(ns.getDate()).toBe(15);
    expect(ne.getDate()).toBe(25);
    // Duration unchanged
    expect(ne.getTime() - ns.getTime()).toBe(end.getTime() - start.getTime());
  });

  test("addUnits grows the timeline by whole units", () => {
    const d = new Date(2023, 0, 1);
    expect(addUnits(d, ViewMode.MONTH, 3).getMonth()).toBe(3);
    expect(addUnits(d, ViewMode.DAY, 7).getDate()).toBe(8);
  });
});

describe("buildTimeUnits", () => {
  test("month view yields one column per month inclusive", () => {
    const units = buildTimeUnits(
      ViewMode.MONTH,
      new Date(2023, 0, 1),
      new Date(2023, 2, 1),
    );
    expect(units.length).toBe(3);
    expect(units[0].getMonth()).toBe(0);
    expect(units[2].getMonth()).toBe(2);
  });

  test("invalid dates yield an empty grid", () => {
    expect(
      buildTimeUnits(ViewMode.MONTH, new Date("nope"), new Date(2023, 0, 1)),
    ).toEqual([]);
  });
});
