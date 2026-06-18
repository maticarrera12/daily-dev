import type {
  Habit,
  HabitPatch,
  HabitRepository,
  NewHabit,
} from "../../src/application/ports/HabitRepository";

export class FakeHabitRepository implements HabitRepository {
  private habits: Habit[] = [];
  private nextId = 1;

  async create(habit: NewHabit): Promise<Habit> {
    const created: Habit = {
      id: this.nextId++,
      name: habit.name,
      imagePath: habit.imagePath,
      createdAt: habit.createdAt,
      active: true,
      currentStreak: 0,
    };
    this.habits.push(created);
    return created;
  }

  async update(id: number, patch: HabitPatch): Promise<void> {
    const habit = this.habits.find((h) => h.id === id);
    if (!habit) return;
    if (patch.name !== undefined) habit.name = patch.name;
    if (patch.imagePath !== undefined) habit.imagePath = patch.imagePath;
  }

  async softDelete(id: number): Promise<void> {
    const habit = this.habits.find((h) => h.id === id);
    if (!habit) return;
    habit.active = false;
  }

  async listActive(): Promise<Habit[]> {
    return this.habits.filter((h) => h.active);
  }

  async updateStreakCache(id: number, streak: number): Promise<void> {
    const habit = this.habits.find((h) => h.id === id);
    if (!habit) return;
    habit.currentStreak = streak;
  }

  // Test helpers (not part of the port contract)
  seed(habit: Habit): void {
    this.habits.push(habit);
    if (habit.id >= this.nextId) this.nextId = habit.id + 1;
  }

  all(): Habit[] {
    return this.habits;
  }
}
