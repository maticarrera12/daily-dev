import { AnimatePresence, motion } from "framer-motion";
import type { HabitTodayViewModel } from "../../application/use-cases/loadToday";
import { cn } from "../../lib/cn";

export interface HabitCardProps {
  habit: HabitTodayViewModel;
  imageUrl: string;
  onToggle: (habitId: number) => void;
  onEdit: (habitId: number) => void;
}

export function HabitCard({ habit, imageUrl, onToggle, onEdit }: HabitCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-3 rounded-3xl border-2 bg-surface-card p-5 text-center shadow-sm transition-colors",
        habit.completedToday ? "border-primary" : "border-transparent",
      )}
    >
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
        className="flex flex-col items-center gap-3"
      >
        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-surface">
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
                className="absolute inset-0 flex items-center justify-center bg-primary/80"
              >
                <span className="text-3xl text-white">✓</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="font-display text-base font-semibold text-slate-900">
          {habit.name}
        </p>

        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
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
