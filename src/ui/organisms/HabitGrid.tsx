import type { HabitTodayViewModel } from "../../application/use-cases/loadToday";
import { HabitCard } from "../molecules/HabitCard";

export interface HabitGridProps {
  habits: HabitTodayViewModel[];
  toImageUrl: (imagePath: string) => string;
  onToggle: (habitId: number) => void;
  onEdit: (habitId: number) => void;
}

export function HabitGrid({ habits, toImageUrl, onToggle, onEdit }: HabitGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          imageUrl={toImageUrl(habit.imagePath)}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
