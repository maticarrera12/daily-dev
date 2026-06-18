import type { LocalDate } from "../../domain/streak/types";
import { computePostItTransform } from "../../domain/calendar/scatter";

export interface MascotPostItProps {
  imageUrl: string;
  name: string;
  habitId: number;
  date: LocalDate;
  indexInDay: number;
  totalInDay: number;
}

/**
 * Read-only by construction — no `onToggle`/`onEdit` prop exists, so there
 * is structurally no way to mutate completion state from a calendar cell
 * (R5.5). Computes its own scatter transform from the pure domain helper;
 * the use case/view-model never carries presentation concerns (style
 * values), matching the hexagonal boundary kept elsewhere in the app.
 */
export function MascotPostIt({
  imageUrl,
  name,
  habitId,
  date,
  indexInDay,
  totalInDay,
}: MascotPostItProps) {
  const { rotationDeg, topPct, leftPct, zIndex } = computePostItTransform(
    habitId,
    date,
    indexInDay,
    totalInDay,
  );

  return (
    <div
      className="absolute h-11 w-11"
      style={{
        top: `${topPct}%`,
        left: `${leftPct}%`,
        transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
        zIndex,
      }}
    >
      <img
        src={imageUrl}
        alt={name}
        className="h-full w-full rounded-full object-cover shadow-sm"
      />
    </div>
  );
}
