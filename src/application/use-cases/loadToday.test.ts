import { beforeEach, describe, expect, test } from "vitest";
import { FakeAppStateRepository } from "../../../tests/fakes/FakeAppStateRepository";
import { FakeClock } from "../../../tests/fakes/FakeClock";
import { FakeDailyRecordRepository } from "../../../tests/fakes/FakeDailyRecordRepository";
import { FakeHabitRepository } from "../../../tests/fakes/FakeHabitRepository";
import { loadToday } from "./loadToday";

describe("loadToday", () => {
  let habitRepo: FakeHabitRepository;
  let recordRepo: FakeDailyRecordRepository;
  let appStateRepo: FakeAppStateRepository;
  let clock: FakeClock;

  beforeEach(() => {
    habitRepo = new FakeHabitRepository();
    recordRepo = new FakeDailyRecordRepository();
    appStateRepo = new FakeAppStateRepository();
    clock = new FakeClock("2026-06-17");
  });

  test("global reset: app closed 3+ days hard-resets every habit's streak to 0, even one sitting on its grace day", async () => {
    // Habit was on a 1-day grace hold (would otherwise compute to a
    // non-zero streak via computeStreak) as of last_open_date.
    habitRepo.seed({
      id: 1,
      name: "Drink water",
      imagePath: "/managed/1.png",
      createdAt: "2026-06-01",
      active: true,
      currentStreak: 5, // stale cache, must be forced to 0
    });
    // Completed days that, evaluated in isolation, would hold via grace.
    recordRepo.seed(1, "2026-06-10", true);
    recordRepo.seed(1, "2026-06-11", true);
    // 2026-06-12 missing (the one grace day) — would normally just hold.

    appStateRepo = new FakeAppStateRepository("2026-06-13"); // 4 days before "today"
    clock.set("2026-06-17");

    const result = await loadToday({
      habitRepository: habitRepo,
      dailyRecordRepository: recordRepo,
      appStateRepository: appStateRepo,
      clock,
    });

    expect(result.habits).toHaveLength(1);
    expect(result.habits[0].currentStreak).toBe(0);
    expect(habitRepo.all()[0].currentStreak).toBe(0); // persisted, not just returned
  });

  test("same-day reopen: streaks unchanged, today's marks preserved, no recompute side effects", async () => {
    habitRepo.seed({
      id: 1,
      name: "Read",
      imagePath: "/managed/1.png",
      createdAt: "2026-06-01",
      active: true,
      currentStreak: 3,
    });
    recordRepo.seed(1, "2026-06-15", true);
    recordRepo.seed(1, "2026-06-16", true);
    recordRepo.seed(1, "2026-06-17", true); // marked earlier today

    appStateRepo = new FakeAppStateRepository("2026-06-17"); // same as today
    clock.set("2026-06-17");

    const result = await loadToday({
      habitRepository: habitRepo,
      dailyRecordRepository: recordRepo,
      appStateRepository: appStateRepo,
      clock,
    });

    expect(result.habits[0].currentStreak).toBe(3);
    expect(result.habits[0].completedToday).toBe(true);
  });

  test("new day with a 1-2 day gap: streaks recomputed via computeStreak, today presented unmarked", async () => {
    habitRepo.seed({
      id: 1,
      name: "Meditate",
      imagePath: "/managed/1.png",
      createdAt: "2026-06-01",
      active: true,
      currentStreak: 999, // stale cache, must be replaced by a fresh computation
    });
    recordRepo.seed(1, "2026-06-15", true);
    recordRepo.seed(1, "2026-06-16", true);
    // today (2026-06-17) not yet marked.

    appStateRepo = new FakeAppStateRepository("2026-06-16"); // 1 day gap
    clock.set("2026-06-17");

    const result = await loadToday({
      habitRepository: habitRepo,
      dailyRecordRepository: recordRepo,
      appStateRepository: appStateRepo,
      clock,
    });

    expect(result.habits[0].currentStreak).toBe(2);
    expect(result.habits[0].completedToday).toBe(false);
    expect(habitRepo.all()[0].currentStreak).toBe(2); // persisted cache
  });

  test("persists today as the new last_open_date after reconciliation", async () => {
    habitRepo.seed({
      id: 1,
      name: "Stretch",
      imagePath: "/managed/1.png",
      createdAt: "2026-06-01",
      active: true,
      currentStreak: 0,
    });
    appStateRepo = new FakeAppStateRepository("2026-06-16");
    clock.set("2026-06-17");

    await loadToday({
      habitRepository: habitRepo,
      dailyRecordRepository: recordRepo,
      appStateRepository: appStateRepo,
      clock,
    });

    expect(await appStateRepo.getLastOpenDate()).toBe("2026-06-17");
  });

  test("first-ever open: no last_open_date recorded yet behaves like a fresh day, not a 3+ day reset", async () => {
    habitRepo.seed({
      id: 1,
      name: "Journal",
      imagePath: "/managed/1.png",
      createdAt: "2026-06-17",
      active: true,
      currentStreak: 0,
    });
    appStateRepo = new FakeAppStateRepository(null);
    clock.set("2026-06-17");

    const result = await loadToday({
      habitRepository: habitRepo,
      dailyRecordRepository: recordRepo,
      appStateRepository: appStateRepo,
      clock,
    });

    expect(result.habits[0].currentStreak).toBe(0);
    expect(await appStateRepo.getLastOpenDate()).toBe("2026-06-17");
  });

  test("local-date correctness: today is derived strictly from the Clock port, never from UTC ISO slicing", async () => {
    // A Clock that would expose UTC-vs-local drift: if loadToday ever fell
    // back to `new Date().toISOString().slice(0, 10)` instead of using the
    // injected Clock, this test's local date would be silently ignored and
    // the assertions below would fail in a way that reveals the bug.
    const driftingLocalDate = "2026-01-01"; // arbitrary local date far from any real "now"
    clock = new FakeClock(driftingLocalDate);
    appStateRepo = new FakeAppStateRepository("2025-12-31"); // 1 day gap from the FAKE local date

    habitRepo.seed({
      id: 1,
      name: "Whatever today is",
      imagePath: "/managed/1.png",
      createdAt: "2025-12-01",
      active: true,
      currentStreak: 0,
    });

    const result = await loadToday({
      habitRepository: habitRepo,
      dailyRecordRepository: recordRepo,
      appStateRepository: appStateRepo,
      clock,
    });

    expect(result.today).toBe(driftingLocalDate);
    expect(await appStateRepo.getLastOpenDate()).toBe(driftingLocalDate);
  });
});
