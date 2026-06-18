import type { LocalDate } from "../../domain/streak/types";

export interface AppStateRepository {
  getLastOpenDate(): Promise<LocalDate | null>;
  setLastOpenDate(date: LocalDate): Promise<void>;
}
