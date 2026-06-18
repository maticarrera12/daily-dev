import type { DailyRecord, LocalDate } from "../../domain/streak/types";

export interface DailyRecordRepository {
  upsertToggle(
    habitId: number,
    date: LocalDate,
    completed: boolean,
  ): Promise<void>;
  listForHabit(habitId: number): Promise<DailyRecord[]>;
}
