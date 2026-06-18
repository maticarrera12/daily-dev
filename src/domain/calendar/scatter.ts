import type { LocalDate } from "../streak/types";

export interface PostItTransform {
  rotationDeg: number; // bounded, [-8, 8]
  offsetXPercent: number; // small jitter, [-6, 6]
  offsetYPercent: number; // small jitter, [-6, 6]
  zIndex: number; // driven by indexInDay only
}

const MAX_ROTATION_DEG = 8;
const MAX_OFFSET_PERCENT = 6;

/** FNV-1a (32-bit, no crypto, pure integer ops). */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  return hash >>> 0; // unsigned 32-bit
}

/**
 * Deterministic pure transform seeded by `(habitId, date)` only —
 * `indexInDay` affects ONLY zIndex (R2.5), never rotation/offset, so
 * inserting/removing other mascots on the same day never reshuffles an
 * already-rendered post-it's position (stable across re-renders, R2.2).
 */
export function computePostItTransform(
  habitId: number,
  date: LocalDate,
  indexInDay: number,
): PostItTransform {
  const hash = fnv1a(`${habitId}:${date}`);

  const rotationDeg =
    ((hash & 0xff) / 255) * 2 * MAX_ROTATION_DEG - MAX_ROTATION_DEG;
  const offsetXPercent =
    (((hash >>> 8) & 0xff) / 255) * 2 * MAX_OFFSET_PERCENT - MAX_OFFSET_PERCENT;
  const offsetYPercent =
    (((hash >>> 16) & 0xff) / 255) * 2 * MAX_OFFSET_PERCENT - MAX_OFFSET_PERCENT;

  return {
    rotationDeg,
    offsetXPercent,
    offsetYPercent,
    zIndex: indexInDay,
  };
}
