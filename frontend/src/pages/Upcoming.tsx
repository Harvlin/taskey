import { Calendar } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { TaskList } from "@/features/tasks/TaskList";
import { AddTaskInline } from "@/features/tasks/AddTaskInline";
import { ViewHeader } from "@/components/ViewHeader";
import { format, parseISO, addDays, isSameDay } from "date-fns";

export default function Upcoming() {
  const { data: tasks = [] } = useTasks();
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <ViewHeader icon={<Calendar className="h-6 w-6 text-p2" />} title="Upcoming" subtitle="Plan your week ahead" />
      <div className="space-y-8">
        {days.map((day) => {
          const list = tasks.filter((t) => !t.completed && t.dueDate && isSameDay(parseISO(t.dueDate), day)).sort((a, b) => a.order - b.order);
          return (
            <div key={day.toISOString()}>
              <div className="flex items-center gap-2 border-b border-border pb-1.5 mb-1">
                <span className="text-sm font-semibold">{format(day, "EEE d MMM")}</span>
                <span className="text-xs text-muted-foreground">· {list.length} tasks</span>
              </div>
              {list.length > 0 ? <TaskList tasks={list} /> : <p className="text-xs text-muted-foreground py-2">Nothing scheduled</p>}
              <AddTaskInline dueDate={day.toISOString().slice(0, 10)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}