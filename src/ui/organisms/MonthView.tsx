import type { CalendarDayResult } from "../../application/use-cases/loadCalendar";
import type { MonthGridDay } from "../../domain/calendar/grid";
import type { LocalDate } from "../../domain/streak/types";
import { CALENDAR_GRID_CLASS } from "../calendarLayout";
import { DayCell } from "../molecules/DayCell";
import { WeekdayHeader } from "../atoms/WeekdayHeader";

export interface MonthViewProps {
  grid: MonthGridDay[]; // 35 or 42 cells, Monday-start, leading/trailing tagged
  days: Map<LocalDate, CalendarDayResult>;
  toImageUrl: (imagePath: string) => string;
}

export function MonthView({ grid, days, toImageUrl }: MonthViewProps) {
  return (
    <>
      <WeekdayHeader />
      <div className={CALENDAR_GRID_CLASS}>
        {grid.map((cell) => {
          const day = days.get(cell.date);
          return (
            <DayCell
              key={cell.date}
              date={cell.date}
              dayNumber={Number(cell.date.slice(8, 10))}
              inMonth={cell.inMonth}
              mascots={day?.mascots ?? []}
              overflowCount={day?.overflowCount ?? 0}
              toImageUrl={toImageUrl}
            />
          );
        })}
      </div>
    </>
  );
}
