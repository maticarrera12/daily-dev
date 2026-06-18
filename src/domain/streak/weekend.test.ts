import { describe, expect, test } from "vitest";
import {
  dayOfWeekUtc,
  isWeekendUtc,
  nextDate,
  previousDate,
  scheduledDaysMissed,
} from "./weekend";

describe("dayOfWeekUtc", () => {
  test("returns 6 (Saturday) for a known Saturday", () => {
    expect(dayOfWeekUtc("2026-06-13")).toBe(6);
  });

  test("returns 0 (Sunday) for a known Sunday", () => {
    expect(dayOfWeekUtc("2026-06-14")).toBe(0);
  });

  test("returns the correct UTC day for a known weekday (Friday = 5)", () => {
    expect(dayOfWeekUtc("2026-06-12")).toBe(5);
  });

  test("uses UTC day-of-week semantics, not local-time getDay() (a date near a UTC midnight boundary must not drift)", () => {
    // 2026-06-13 is a Saturday in UTC terms. If this were ever implemented
    // as `new Date("2026-06-13").getDay()`, the result would depend on the
    // host machine's local timezone offset around the UTC-midnight boundary
    // for that ISO string (e.g. a negative-UTC-offset zone could read it as
    // Friday). The UTC-safe implementation must always report Saturday (6)
    // regardless of the host's local timezone.
    expect(dayOfWeekUtc("2026-06-13")).toBe(6);
  });
});

describe("isWeekendUtc", () => {
  test("returns true for a Saturday", () => {
    expect(isWeekendUtc("2026-06-13")).toBe(true);
  });

  test("returns true for a Sunday", () => {
    expect(isWeekendUtc("2026-06-14")).toBe(true);
  });

  test.each([
    ["2026-06-15", "Monday"],
    ["2026-06-16", "Tuesday"],
    ["2026-06-17", "Wednesday"],
    ["2026-06-18", "Thursday"],
    ["2026-06-19", "Friday"],
  ])("returns false for a %s (%s)", (date) => {
    expect(isWeekendUtc(date)).toBe(false);
  });
});

describe("scheduledDaysMissed", () => {
  // Boundary is EXCLUSIVE of both ends: lastOpenDate (Fri 06-12) and today
  // (Tue 06-16) are never counted themselves, only days strictly between.
  test("Fri -> Tue gap, skipWeekends:true: only the Monday counts (1 scheduled day)", () => {
    expect(scheduledDaysMissed("2026-06-12", "2026-06-16", true)).toBe(1);
  });

  test("Fri -> Tue gap, skipWeekends:false: Sat/Sun/Mon all count as scheduled (3 calendar days)", () => {
    expect(scheduledDaysMissed("2026-06-12", "2026-06-16", false)).toBe(3);
  });

  test("lastOpenDate === null returns 0 regardless of today/skipWeekends", () => {
    expect(scheduledDaysMissed(null, "2026-06-16", true)).toBe(0);
  });
});

describe("nextDate", () => {
  test("returns the calendar day after the given date", () => {
    expect(nextDate("2026-06-17")).toBe("2026-06-18");
  });

  test("rolls over a month boundary", () => {
    expect(nextDate("2026-06-30")).toBe("2026-07-01");
  });

  test("rolls over a year boundary", () => {
    expect(nextDate("2026-12-31")).toBe("2027-01-01");
  });
});

describe("previousDate", () => {
  test("returns the calendar day before the given date", () => {
    expect(previousDate("2026-06-17")).toBe("2026-06-16");
  });

  test("rolls back over a month boundary", () => {
    expect(previousDate("2026-07-01")).toBe("2026-06-30");
  });

  test("rolls back over a year boundary", () => {
    expect(previousDate("2027-01-01")).toBe("2026-12-31");
  });
});
