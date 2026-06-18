import type { DailyRecordRepository } from "../../src/application/ports/DailyRecordRepository";
import type { DailyRecord, LocalDate } from "../../src/domain/streak/types";

interface StoredRecord extends DailyRecord {
  habitId: number;
}

export class FakeDailyRecordRepository implements DailyRecordRepository {
  private records: StoredRecord[] = [];

  async upsertToggle(
    habitId: number,
    date: LocalDate,
    completed: boolean,
  ): Promise<void> {
    const index = this.records.findIndex(
      (r) => r.habitId === habitId && r.date === date,
    );

    if (!completed) {
      // Sparse storage: uncompleting removes the row entirely.
      if (index !== -1) this.records.splice(index, 1);
      return;
    }

    if (index !== -1) {
      this.records[index].completed = true;
      return;
    }

    this.records.push({ habitId, date, completed: true });
  }

  async listForHabit(habitId: number): Promise<DailyRecord[]> {
    return this.records
      .filter((r) => r.habitId === habitId)
      .map(({ date, completed }) => ({ date, completed }));
  }

  // Test helper
  seed(habitId: number, date: LocalDate, completed: boolean): void {
    this.records.push({ habitId, date, completed });
  }
}
