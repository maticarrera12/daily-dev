import { AnimatePresence, motion } from "framer-motion";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { HabitTodayViewModel } from "../../application/use-cases/loadToday";
import { cn } from "../../lib/cn";

export interface HabitCardProps {
  habit: HabitTodayViewModel;
  imageUrl: string;
  onToggle: (habitId: number) => void;
  onEdit: (habitId: number) => void;
  dragHandleProps?: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
}

export function HabitCard({
  habit,
  imageUrl,
  onToggle,
  onEdit,
  dragHandleProps,
}: HabitCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-3xl border-2 bg-surface-card p-5 text-center shadow-sm transition-colors",
        habit.completedToday ? "border-primary" : "border-transparent",
      )}
    >
      {dragHandleProps && (
        <button
          type="button"
          aria-label={`Drag ${habit.name} to reorder`}
          className="absolute left-3 top-3 cursor-grab touch-none rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
        >
          <span aria-hidden="true" className="block text-sm leading-none">
            ⠿
          </span>
        </button>
      )}

      <button
        type="button"
        aria-label={`Edit ${habit.name}`}
        onClick={() => onEdit(habit.id)}
        className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        ✏️
      </button>

      <motion.button
        type="button"
        aria-pressed={habit.completedToday}
        aria-label={habit.name}
        onClick={() => onToggle(habit.id)}
        whileTap={{ scale: 0.95 }}
        className="flex flex-1 flex-col items-center gap-3 pt-2"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-surface">
          <img
            src={imageUrl}
            alt={habit.name}
            className="h-full w-full object-cover"
          />
          <AnimatePresence>
            {habit.completedToday && (
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute inset-0 flex items-center justify-center bg-primary/25"
              >
                <span className="text-2xl font-bold text-primary drop-shadow-sm">✓</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="line-clamp-2 min-h-[2.75rem] w-full font-display text-base font-semibold leading-snug text-slate-900">
          {habit.name}
        </p>

        <div className="mt-auto flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
          <span aria-hidden="true">🔥</span>
          <motion.span
            key={habit.currentStreak}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="text-sm font-bold text-primary"
          >
            {habit.currentStreak}
          </motion.span>
        </div>
      </motion.button>
    </div>
  );
}
