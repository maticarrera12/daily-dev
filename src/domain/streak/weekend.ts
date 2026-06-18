import type { LocalDate } from "./types";

/**
 * UTC-safe day-of-week. NEVER use `new Date(dateString).getDay()` — that
 * reads the host machine's LOCAL timezone offset and can drift by one day
 * around midnight boundaries. `LocalDate` strings are calendar dates with no
 * timezone attached, so they must always be parsed as UTC midnight.
 *
 * Returns 0=Sunday .. 6=Saturday (matches `Date.prototype.getUTCDay()`).
 */
export function dayOfWeekUtc(date: LocalDate): number {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** True for Saturday (6) or Sunday (0), per `dayOfWeekUtc`. */
export function isWeekendUtc(date: LocalDate): boolean {
  const dow = dayOfWeekUtc(date);
  return dow === 0 || dow === 6;
}

/**
 * Counts SCHEDULED days strictly between `lastOpenDate` and `today` — both
 * ends EXCLUSIVE. A day is "scheduled" unless `skipWeekends` is true and the
 * day is a weekend day (per `isWeekendUtc`).
 *
 * `lastOpenDate === null` (no prior open recorded) returns 0 — there is no
 * gap to evaluate.
 */
export function scheduledDaysMissed(
  lastOpenDate: LocalDate | null,
  today: LocalDate,
  skipWeekends: boolean,
): number {
  if (lastOpenDate === null) return 0;

  let count = 0;
  let cursor = nextDate(lastOpenDate);
  while (cursor < today) {
    if (!skipWeekends || !isWeekendUtc(cursor)) {
      count += 1;
    }
    cursor = nextDate(cursor);
  }
  return count;
}

export function nextDate(date: LocalDate): LocalDate {
  const [year, month, day] = date.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  utcDate.setUTCDate(utcDate.getUTCDate() + 1);
  return utcDate.toISOString().slice(0, 10);
}

export function previousDate(date: LocalDate): LocalDate {
  const [year, month, day] = date.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  utcDate.setUTCDate(utcDate.getUTCDate() - 1);
  return utcDate.toISOString().slice(0, 10);
}
