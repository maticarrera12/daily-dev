import { describe, expect, test } from "vitest";
import { createHabitEntity } from "./Habit";

describe("Habit entity", () => {
  test("rejects an empty name", () => {
    expect(() =>
      createHabitEntity({
        name: "",
        imagePath: "/path/to/image.png",
        createdAt: "2026-06-17",
      }),
    ).toThrow();
  });

  test("rejects a whitespace-only name", () => {
    expect(() =>
      createHabitEntity({
        name: "   ",
        imagePath: "/path/to/image.png",
        createdAt: "2026-06-17",
      }),
    ).toThrow();
  });

  test("accepts a valid non-empty name", () => {
    const habit = createHabitEntity({
      name: "Drink water",
      imagePath: "/path/to/image.png",
      createdAt: "2026-06-17",
    });

    expect(habit.name).toBe("Drink water");
  });
});
