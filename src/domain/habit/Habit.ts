import type { LocalDate } from "../streak/types";

export interface Habit {
  name: string;
  imagePath: string;
  createdAt: LocalDate;
}

export function createHabitEntity(input: Habit): Habit {
  if (input.name.trim().length === 0) {
    throw new Error("Habit name must not be empty");
  }

  return input;
}
