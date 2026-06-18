import type { LocalDate } from "../../domain/streak/types";

/**
 * Yields the current LOCAL calendar date as YYYY-MM-DD.
 *
 * Never derive "today" via `new Date().toISOString().slice(0, 10)` — that
 * reads the UTC calendar date, which drifts from the user's local date near
 * midnight (e.g. 11:30pm local in UTC-3 is already "tomorrow" in UTC). All
 * orchestration that needs "today" (loadToday, toggleHabitToday, createHabit)
 * MUST go through this port instead of touching `Date` directly, so tests can
 * inject a fixed/fake local date and infrastructure can supply the real one
 * via `date.getFullYear()/getMonth()/getDate()` (local accessors).
 */
export interface Clock {
  today(): LocalDate;
}
