import { Task } from "@/types";
import { TaskItem } from "./TaskItem";
import { AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }} {...attributes} {...listeners}>
      <TaskItem task={task} />
    </div>
  );
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const qc = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = tasks.findIndex((t) => t.id === active.id);
    const newIdx = tasks.findIndex((t) => t.id === over.id);
    const next = arrayMove(tasks, oldIdx, newIdx);
    const all = qc.getQueryData<Task[]>(["tasks"]) || [];
    const ids = new Set(next.map((t) => t.id));
    const reordered = [...next, ...all.filter((t) => !ids.has(t.id))];
    qc.setQueryData(["tasks"], reordered);
    api.reorderTasks(next.map((t) => t.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <AnimatePresence initial={false}>
          {tasks.map((t) => <SortableTask key={t.id} task={t} />)}
        </AnimatePresence>
      </SortableContext>
    </DndContext>
  );
}