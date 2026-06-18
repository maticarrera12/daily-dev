import type { HabitRepository } from "../ports/HabitRepository";

export interface DeleteHabitDeps {
  habitRepository: HabitRepository;
}

export async function deleteHabit(
  habitId: number,
  deps: DeleteHabitDeps,
): Promise<void> {
  await deps.habitRepository.softDelete(habitId);
}
