import type { AppStateRepository } from "../../src/application/ports/AppStateRepository";
import type { LocalDate } from "../../src/domain/streak/types";

export class FakeAppStateRepository implements AppStateRepository {
  constructor(private lastOpenDate: LocalDate | null = null) {}

  async getLastOpenDate(): Promise<LocalDate | null> {
    return this.lastOpenDate;
  }

  async setLastOpenDate(date: LocalDate): Promise<void> {
    this.lastOpenDate = date;
  }
}
