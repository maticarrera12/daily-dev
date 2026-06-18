import { create } from "zustand";
import type { HabitTrackerApp } from "../infrastructure/composition/createHabitTrackerApp";
import type { CalendarDayResult } from "../application/use-cases/loadCalendar";
import { monthGrid, weekDays } from "../domain/calendar/grid";
import { nextDate, previousDate } from "../domain/streak/weekend";
import type { LocalDate } from "../domain/streak/types";

export type CalendarMode = "week" | "month";

export interface CalendarStore {
  mode: CalendarMode;
  anchorDate: LocalDate;
  days: Map<LocalDate, CalendarDayResult>;
  isLoading: boolean;
  error: string | null;
  setMode: (mode: CalendarMode) => void;
  load: (anchorDate: LocalDate) => Promise<void>;
  goToPrevious: () => Promise<void>;
  goToNext: () => Promise<void>;
  clearError: () => void;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong";
}

function datesForMode(mode: CalendarMode, anchorDate: LocalDate): LocalDate[] {
  return mode === "week"
    ? weekDays(anchorDate)
    : monthGrid(anchorDate).map((cell) => cell.date);
}

/** Shift week mode by ±7 days; shift month mode to day 1 of the ±1 month. */
function shiftAnchor(
  anchorDate: LocalDate,
  mode: CalendarMode,
  direction: 1 | -1,
): LocalDate {
  if (mode === "week") {
    let cursor = anchorDate;
    for (let i = 0; i < 7; i++) {
      cursor = direction === 1 ? nextDate(cursor) : previousDate(cursor);
    }
    return cursor;
  }

  const [year, month, day] = anchorDate.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1 + direction, day));
  return utcDate.toISOString().slice(0, 10);
}

/**
 * Thin Zustand store (zustand-5 single-concern, no slices/middleware —
 * calendar state is ephemeral). Mirrors createHabitStore's factory pattern
 * so it can be wired against the real composition root or a fake in tests.
 */
export function createCalendarStore(app: HabitTrackerApp) {
  return create<CalendarStore>((set, get) => ({
    mode: "week",
    anchorDate: "",
    days: new Map(),
    isLoading: false,
    error: null,

    setMode: (mode) => {
      set({ mode });
      get().load(get().anchorDate);
    },

    load: async (anchorDate) => {
      set({ isLoading: true, error: null, anchorDate });
      try {
        const dates = datesForMode(get().mode, anchorDate);
        const result = await app.loadCalendar({
          from: dates[0],
          to: dates[dates.length - 1],
          allDatesInOrder: dates,
        });
        set({ days: result.days, isLoading: false });
      } catch (error) {
        set({ error: toErrorMessage(error), isLoading: false });
      }
    },

    goToPrevious: async () => {
      const next = shiftAnchor(get().anchorDate, get().mode, -1);
      await get().load(next);
    },

    goToNext: async () => {
      const next = shiftAnchor(get().anchorDate, get().mode, 1);
      await get().load(next);
    },

    clearError: () => set({ error: null }),
  }));
}
