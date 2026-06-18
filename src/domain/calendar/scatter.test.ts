import { describe, expect, test } from "vitest";
import { computePostItTransform } from "./scatter";

const MAX_ROTATION_DEG = 8;
const MIN_PCT = 0;
const MAX_PCT = 100;

describe("computePostItTransform", () => {
  test("scenario 12: identical (habitId, date, indexInDay, totalInDay) inputs produce deep-equal output", () => {
    const first = computePostItTransform(7, "2026-06-17", 0, 4);
    const second = computePostItTransform(7, "2026-06-17", 0, 4);
    expect(first).toEqual(second);
  });

  test("scenario 13: different (habitId, date) pairs produce different transforms across a sample", () => {
    const samples = [
      computePostItTransform(1, "2026-06-17", 0, 4),
      computePostItTransform(2, "2026-06-17", 0, 4),
      computePostItTransform(1, "2026-06-18", 0, 4),
      computePostItTransform(99, "2026-01-01", 0, 4),
      computePostItTransform(42, "2026-12-31", 0, 4),
    ];
    const unique = new Set(
      samples.map((s) => `${s.rotationDeg}:${s.topPct}:${s.leftPct}`),
    );
    expect(unique.size).toBeGreaterThan(1);
  });

  test("scenario 14: a sweep of many (habitId, date) combinations always stays within the rotation bound", () => {
    for (let habitId = 0; habitId < 50; habitId++) {
      for (let day = 1; day <= 28; day++) {
        const date = `2026-06-${String(day).padStart(2, "0")}`;
        const { rotationDeg } = computePostItTransform(habitId, date, 0, 4);
        expect(rotationDeg).toBeGreaterThanOrEqual(-MAX_ROTATION_DEG);
        expect(rotationDeg).toBeLessThanOrEqual(MAX_ROTATION_DEG);
      }
    }
  });

  test("scenario 15: indexInDay drives a distinct grid-cell position, not just z-order", () => {
    const a = computePostItTransform(7, "2026-06-17", 0, 4);
    const b = computePostItTransform(7, "2026-06-17", 1, 4);
    expect(a.topPct !== b.topPct || a.leftPct !== b.leftPct).toBe(true);
    expect(a.zIndex).not.toBe(b.zIndex);
  });

  test("all indices within a 4-mascot day produce pairwise distinct positions (no stacking)", () => {
    const totalInDay = 4;
    const transforms = Array.from({ length: totalInDay }, (_, index) =>
      computePostItTransform(7, "2026-06-17", index, totalInDay),
    );

    const positions = transforms.map((t) => `${t.topPct}:${t.leftPct}`);
    const unique = new Set(positions);
    expect(unique.size).toBe(positions.length);
  });

  test("all indices within a 12-mascot day produce pairwise distinct positions (no stacking)", () => {
    const totalInDay = 12;
    const transforms = Array.from({ length: totalInDay }, (_, index) =>
      computePostItTransform(13, "2026-06-20", index, totalInDay),
    );

    const positions = transforms.map((t) => `${t.topPct}:${t.leftPct}`);
    const unique = new Set(positions);
    expect(unique.size).toBe(positions.length);
  });

  test("count=1 edge case: single mascot still returns a valid, clamped position", () => {
    const result = computePostItTransform(7, "2026-06-17", 0, 1);
    expect(result.topPct).toBeGreaterThanOrEqual(MIN_PCT);
    expect(result.topPct).toBeLessThanOrEqual(MAX_PCT);
    expect(result.leftPct).toBeGreaterThanOrEqual(MIN_PCT);
    expect(result.leftPct).toBeLessThanOrEqual(MAX_PCT);
  });

  test("positions stay within [0,100] clamped percentage bounds across a sweep of counts", () => {
    const totals = [1, 4, 12];
    for (let habitId = 0; habitId < 30; habitId++) {
      for (let day = 1; day <= 28; day++) {
        const date = `2026-06-${String(day).padStart(2, "0")}`;
        for (const totalInDay of totals) {
          for (let index = 0; index < totalInDay; index++) {
            const { topPct, leftPct } = computePostItTransform(
              habitId,
              date,
              index,
              totalInDay,
            );
            expect(topPct).toBeGreaterThanOrEqual(MIN_PCT);
            expect(topPct).toBeLessThanOrEqual(MAX_PCT);
            expect(leftPct).toBeGreaterThanOrEqual(MIN_PCT);
            expect(leftPct).toBeLessThanOrEqual(MAX_PCT);
          }
        }
      }
    }
  });

  test("distribution scales to count: a 12-mascot day spreads across a wider top/left range than a 4-mascot day's single grid cell would", () => {
    const totalInDay = 12;
    const transforms = Array.from({ length: totalInDay }, (_, index) =>
      computePostItTransform(20, "2026-06-22", index, totalInDay),
    );

    const tops = transforms.map((t) => t.topPct);
    const lefts = transforms.map((t) => t.leftPct);
    const topSpread = Math.max(...tops) - Math.min(...tops);
    const leftSpread = Math.max(...lefts) - Math.min(...lefts);

    // 12 items → ceil(sqrt(12))=4 cols x 3 rows: should spread across most
    // of the cell, not cluster within a single small region.
    expect(topSpread).toBeGreaterThan(30);
    expect(leftSpread).toBeGreaterThan(30);
  });

  test("indexInDay beyond totalInDay still returns a valid clamped position (defensive)", () => {
    const result = computePostItTransform(7, "2026-06-17", 99, 4);
    expect(result.topPct).toBeGreaterThanOrEqual(MIN_PCT);
    expect(result.topPct).toBeLessThanOrEqual(MAX_PCT);
    expect(result.leftPct).toBeGreaterThanOrEqual(MIN_PCT);
    expect(result.leftPct).toBeLessThanOrEqual(MAX_PCT);
  });

  test("totalInDay=0 (defensive) still returns a valid clamped position", () => {
    const result = computePostItTransform(7, "2026-06-17", 0, 0);
    expect(result.topPct).toBeGreaterThanOrEqual(MIN_PCT);
    expect(result.topPct).toBeLessThanOrEqual(MAX_PCT);
    expect(result.leftPct).toBeGreaterThanOrEqual(MIN_PCT);
    expect(result.leftPct).toBeLessThanOrEqual(MAX_PCT);
  });
});
