import type { LocalDate } from "../streak/types";
import { dayOfWeekUtc, nextDate, previousDate } from "../streak/weekend";

export interface MonthGridDay {
  date: LocalDate;
  inMonth: boolean; // false for leading/trailing days from adjacent months
}

/** Monday-start `LocalDate` on/before `date` (ISO: Monday=1 per `getUTCDay()`). */
function mondayOf(date: LocalDate): LocalDate {
  let cursor = date;
  while (dayOfWeekUtc(cursor) !== 1) {
    cursor = previousDate(cursor);
  }
  return cursor;
}

/** Monday-start 7-day week containing `date`. Index 0 = Monday, 6 = Sunday. */
export function weekDays(date: LocalDate): LocalDate[] {
  const monday = mondayOf(date);
  const days: LocalDate[] = [];
  let cursor = monday;
  for (let i = 0; i < 7; i++) {
    days.push(cursor);
    cursor = nextDate(cursor);
  }
  return days;
}

/**
 * Monday-start month grid for the month containing `monthAnchor` (any
 * LocalDate within the target month). Always returns a multiple of 7 cells
 * (35 or 42): leading days from the previous month, all in-month days, and
 * trailing days from the next month to complete the last row.
 */
export function monthGrid(monthAnchor: LocalDate): MonthGridDay[] {
  const [year, month] = monthAnchor.split("-").map(Number);
  const targetMonth = `${year}-${String(month).padStart(2, "0")}`;

  const firstDay = toLocalDate(Date.UTC(year, month - 1, 1));
  const lastDay = toLocalDate(Date.UTC(year, month, 0)); // day 0 of next month = last day of this month

  const gridStart = mondayOf(firstDay);
  const sundayAfterLastDay = lastDayOfWeek(lastDay);

  const days: MonthGridDay[] = [];
  let cursor = gridStart;
  while (cursor <= sundayAfterLastDay) {
    days.push({
      date: cursor,
      inMonth: cursor.slice(0, 7) === targetMonth,
    });
    cursor = nextDate(cursor);
  }
  return days;
}

function lastDayOfWeek(date: LocalDate): LocalDate {
  let cursor = date;
  while (dayOfWeekUtc(cursor) !== 0) {
    cursor = nextDate(cursor);
  }
  return cursor;
}

function toLocalDate(utcMillis: number): LocalDate {
  return new Date(utcMillis).toISOString().slice(0, 10);
}
