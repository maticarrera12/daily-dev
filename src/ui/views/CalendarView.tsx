import { useEffect } from "react";
import type { HabitTrackerApp } from "../../infrastructure/composition/createHabitTrackerApp";
import { formatLocalDate } from "../../infrastructure/clock/formatLocalDate";
import type { CalendarMode, CalendarStore, createCalendarStore } from "../../state/calendarStore";
import { WeekView } from "../organisms/WeekView";
import { MonthView } from "../organisms/MonthView";
import { weekDays, monthGrid } from "../../domain/calendar/grid";
import {
  CALENDAR_BLOCK_CLASS,
  CALENDAR_SCROLL_CLASS,
} from "../calendarLayout";

export interface CalendarViewProps {
  useCalendarStore: ReturnType<typeof createCalendarStore>;
  app: HabitTrackerApp;
  mode: CalendarMode;
}

export function CalendarView({ useCalendarStore, app, mode }: CalendarViewProps) {
  const anchorDate = useCalendarStore((state: CalendarStore) => state.anchorDate);
  const days = useCalendarStore((state: CalendarStore) => state.days);
  const load = useCalendarStore((state: CalendarStore) => state.load);
  const setMode = useCalendarStore((state: CalendarStore) => state.setMode);
  const goToPrevious = useCalendarStore((state: CalendarStore) => state.goToPrevious);
  const goToNext = useCalendarStore((state: CalendarStore) => state.goToNext);

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  useEffect(() => {
    if (!anchorDate) {
      load(formatLocalDate(new Date()));
    }
  }, [anchorDate, load]);

  const toImageUrl = (path: string) => app.toRenderableImageUrl(path);

  return (
    <section className="mx-auto mt-10 w-full">
      <div className={CALENDAR_SCROLL_CLASS}>
        <div className={CALENDAR_BLOCK_CLASS}>
          <header className="mb-4 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goToPrevious()}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-surface-card"
            >
              ← Previous
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goToNext()}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-surface-card"
            >
              Next →
            </button>
          </header>

          {mode === "week" ? (
            <WeekView
              weekDates={anchorDate ? weekDays(anchorDate) : []}
              days={days}
              toImageUrl={toImageUrl}
            />
          ) : (
            <MonthView
              grid={anchorDate ? monthGrid(anchorDate) : []}
              days={days}
              toImageUrl={toImageUrl}
            />
          )}
        </div>
      </div>
    </section>
  );
}
