import type { HabitRepository } from "../ports/HabitRepository";

export interface ReorderHabitsDeps {
  habitRepository: HabitRepository;
}

export async function reorderHabits(
  orderedHabitIds: number[],
  deps: ReorderHabitsDeps,
): Promise<void> {
  const activeHabits = await deps.habitRepository.listActive();
  const activeIds = new Set(activeHabits.map((habit) => habit.id));

  if (orderedHabitIds.length !== activeHabits.length) {
    throw new Error("Reorder list must include every active habit exactly once");
  }

  const seen = new Set<number>();
  for (const habitId of orderedHabitIds) {
    if (!activeIds.has(habitId)) {
      throw new Error(`Habit ${habitId} is not active`);
    }
    if (seen.has(habitId)) {
      throw new Error(`Duplicate habit id ${habitId} in reorder list`);
    }
    seen.add(habitId);
  }

  await deps.habitRepository.updateOrder(orderedHabitIds);
}
