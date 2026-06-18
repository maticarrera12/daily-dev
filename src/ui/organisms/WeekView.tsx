import type { CalendarDayResult } from "../../application/use-cases/loadCalendar";
import type { LocalDate } from "../../domain/streak/types";
import { CALENDAR_GRID_CLASS } from "../calendarLayout";
import { DayCell } from "../molecules/DayCell";
import { WeekdayHeader } from "../atoms/WeekdayHeader";

export interface WeekViewProps {
  weekDates: LocalDate[]; // exactly 7, Monday..Sunday
  days: Map<LocalDate, CalendarDayResult>;
  toImageUrl: (imagePath: string) => string;
}

export function WeekView({ weekDates, days, toImageUrl }: WeekViewProps) {
  return (
    <>
      <WeekdayHeader />
      <div className={CALENDAR_GRID_CLASS}>
        {weekDates.map((date) => {
          const day = days.get(date);
          return (
            <DayCell
              key={date}
              date={date}
              dayNumber={Number(date.slice(8, 10))}
              inMonth={true}
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
