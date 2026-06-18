import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { HabitTodayViewModel } from "../../application/use-cases/loadToday";
import { cn } from "../../lib/cn";
import { HabitCard } from "../molecules/HabitCard";

export interface HabitGridProps {
  habits: HabitTodayViewModel[];
  toImageUrl: (imagePath: string) => string;
  onToggle: (habitId: number) => void;
  onEdit: (habitId: number) => void;
  onReorder: (habits: HabitTodayViewModel[]) => void;
}

interface SortableHabitCardProps {
  habit: HabitTodayViewModel;
  imageUrl: string;
  onToggle: (habitId: number) => void;
  onEdit: (habitId: number) => void;
}

function SortableHabitCard({
  habit,
  imageUrl,
  onToggle,
  onEdit,
}: SortableHabitCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandleProps: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  } = { attributes, listeners };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("h-full", isDragging && "z-10 opacity-50")}
    >
      <HabitCard
        habit={habit}
        imageUrl={imageUrl}
        onToggle={onToggle}
        onEdit={onEdit}
        dragHandleProps={dragHandleProps}
      />
    </div>
  );
}

export function HabitGrid({
  habits,
  toImageUrl,
  onToggle,
  onEdit,
  onReorder,
}: HabitGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = habits.findIndex((habit) => habit.id === active.id);
    const newIndex = habits.findIndex((habit) => habit.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(habits, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={habits.map((habit) => habit.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 items-stretch gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {habits.map((habit) => (
            <SortableHabitCard
              key={habit.id}
              habit={habit}
              imageUrl={toImageUrl(habit.imagePath)}
              onToggle={onToggle}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
