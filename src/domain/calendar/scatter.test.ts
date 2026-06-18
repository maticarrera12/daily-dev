import { describe, expect, test } from "vitest";
import { computePostItTransform } from "./scatter";

const MAX_ROTATION_DEG = 8;

describe("computePostItTransform", () => {
  test("scenario 12: identical (habitId, date, indexInDay) inputs produce deep-equal output", () => {
    const first = computePostItTransform(7, "2026-06-17", 0);
    const second = computePostItTransform(7, "2026-06-17", 0);
    expect(first).toEqual(second);
  });

  test("scenario 13: different (habitId, date) pairs produce different transforms across a sample", () => {
    const samples = [
      computePostItTransform(1, "2026-06-17", 0),
      computePostItTransform(2, "2026-06-17", 0),
      computePostItTransform(1, "2026-06-18", 0),
      computePostItTransform(99, "2026-01-01", 0),
      computePostItTransform(42, "2026-12-31", 0),
    ];
    const unique = new Set(
      samples.map((s) => `${s.rotationDeg}:${s.offsetXPercent}:${s.offsetYPercent}`),
    );
    expect(unique.size).toBeGreaterThan(1);
  });

  test("scenario 14: a sweep of many (habitId, date) combinations always stays within the rotation bound", () => {
    for (let habitId = 0; habitId < 50; habitId++) {
      for (let day = 1; day <= 28; day++) {
        const date = `2026-06-${String(day).padStart(2, "0")}`;
        const { rotationDeg } = computePostItTransform(habitId, date, 0);
        expect(rotationDeg).toBeGreaterThanOrEqual(-MAX_ROTATION_DEG);
        expect(rotationDeg).toBeLessThanOrEqual(MAX_ROTATION_DEG);
      }
    }
  });

  test("scenario 15: indexInDay 0 vs 1 keep identical rotation/offset but differ in z-order", () => {
    const a = computePostItTransform(7, "2026-06-17", 0);
    const b = computePostItTransform(7, "2026-06-17", 1);
    expect(a.rotationDeg).toBe(b.rotationDeg);
    expect(a.offsetXPercent).toBe(b.offsetXPercent);
    expect(a.offsetYPercent).toBe(b.offsetYPercent);
    expect(a.zIndex).not.toBe(b.zIndex);
  });
});
