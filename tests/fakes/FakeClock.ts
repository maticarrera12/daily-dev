import type { Clock } from "../../src/application/ports/Clock";
import type { LocalDate } from "../../src/domain/streak/types";

export class FakeClock implements Clock {
  constructor(private currentDate: LocalDate) {}

  today(): LocalDate {
    return this.currentDate;
  }

  // Test helper
  set(date: LocalDate): void {
    this.currentDate = date;
  }
}
