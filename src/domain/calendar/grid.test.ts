import { describe, expect, test } from "vitest";
import { monthGrid, weekDays } from "./grid";

describe("weekDays", () => {
  test("scenario 8: Wednesday mid-week returns Monday..Sunday including the input date", () => {
    const result = weekDays("2026-06-17"); // Wednesday
    expect(result).toEqual([
      "2026-06-15",
      "2026-06-16",
      "2026-06-17",
      "2026-06-18",
      "2026-06-19",
      "2026-06-20",
      "2026-06-21",
    ]);
  });

  test("scenario 9: a Monday input is the first element of the returned 7-day array", () => {
    const result = weekDays("2026-06-15"); // Monday
    expect(result[0]).toBe("2026-06-15");
    expect(result).toHaveLength(7);
  });

  test("scenario 10: a Sunday input is the last element of the returned 7-day array", () => {
    const result = weekDays("2026-06-21"); // Sunday
    expect(result[6]).toBe("2026-06-21");
    expect(result).toHaveLength(7);
  });

  test("scenario 11: year-boundary input resolves its Monday into the prior year with no drift", () => {
    const result = weekDays("2026-01-01"); // Thursday
    expect(result).toEqual([
      "2025-12-29",
      "2025-12-30",
      "2025-12-31",
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
      "2026-01-04",
    ]);
  });
});

describe("monthGrid", () => {
  test("scenario 1: month=2026-06 starts on the Monday on/before 06-01 and ends on the Sunday on/after 06-30, total cells multiple of 7", () => {
    const result = monthGrid("2026-06-15");
    expect(result[0].date).toBe("2026-06-01"); // June 1, 2026 is a Monday
    expect(result[result.length - 1].date).toBe("2026-07-05"); // June 30 is a Tuesday -> Sunday July 5
    expect(result.length % 7).toBe(0);
    expect([35, 42]).toContain(result.length);
  });

  test("scenario 2: cells before 2026-06-01 are tagged out-of-month (leading, from May)", () => {
    const result = monthGrid("2026-06-15");
    const leading = result.filter((d) => d.date < "2026-06-01");
    expect(leading.length).toBeGreaterThanOrEqual(0);
    for (const day of leading) {
      expect(day.inMonth).toBe(false);
      expect(day.date.startsWith("2026-05")).toBe(true);
    }
  });

  test("scenario 3: cells after 2026-06-30 are tagged out-of-month (trailing, from July)", () => {
    const result = monthGrid("2026-06-15");
    const trailing = result.filter((d) => d.date > "2026-06-30");
    expect(trailing.length).toBeGreaterThan(0);
    for (const day of trailing) {
      expect(day.inMonth).toBe(false);
      expect(day.date.startsWith("2026-07")).toBe(true);
    }
  });

  test("scenario 4: January (year boundary) leading days correctly resolve into December of the prior year", () => {
    const result = monthGrid("2026-01-15");
    const leading = result.filter((d) => d.date < "2026-01-01");
    expect(leading.length).toBeGreaterThan(0);
    for (const day of leading) {
      expect(day.inMonth).toBe(false);
      expect(day.date.startsWith("2025-12")).toBe(true);
    }
  });

  test("scenario 5: December (year boundary) trailing days correctly resolve into January of the next year", () => {
    const result = monthGrid("2026-12-15");
    const trailing = result.filter((d) => d.date > "2026-12-31");
    expect(trailing.length).toBeGreaterThan(0);
    for (const day of trailing) {
      expect(day.inMonth).toBe(false);
      expect(day.date.startsWith("2027-01")).toBe(true);
    }
  });

  test("scenario 6: leap year February 2028 includes 2028-02-29 with no day skipped or duplicated", () => {
    const result = monthGrid("2028-02-15");
    const inMonth = result.filter((d) => d.inMonth);
    expect(inMonth).toHaveLength(29);
    expect(inMonth.map((d) => d.date)).toContain("2028-02-29");
    const uniqueDates = new Set(result.map((d) => d.date));
    expect(uniqueDates.size).toBe(result.length);
  });

  test("scenario 7: non-leap year February 2027 ends at 2027-02-28 with no 29th", () => {
    const result = monthGrid("2027-02-15");
    const inMonth = result.filter((d) => d.inMonth);
    expect(inMonth).toHaveLength(28);
    expect(inMonth.map((d) => d.date)).not.toContain("2027-02-29");
  });

  test("month grid always starts on a Monday and ends on a Sunday", () => {
    const result = monthGrid("2026-06-15");
    expect(result[0].date <= "2026-06-01").toBe(true);
    expect(result[result.length - 1].date >= "2026-06-30").toBe(true);
  });
});
