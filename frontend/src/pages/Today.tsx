import { CalendarDays, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { TaskList } from "@/features/tasks/TaskList";
import { AddTaskInline } from "@/features/tasks/AddTaskInline";
import { ViewHeader } from "@/components/ViewHeader";
import { format, isToday, isPast, parseISO } from "date-fns";
import { useUI } from "@/store/ui";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateTask } from "@/hooks/use-tasks";

export default function Today() {
  const { data: tasks = [] } = useTasks();
  const search = useUI((s) => s.search);
  const update = useUpdateTask();
  const [overdueOpen, setOverdueOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(false);
  const matches = (t: any) => !search || t.title.toLowerCase().includes(search.toLowerCase());
  const todayActive = tasks.filter((t) => !t.completed && t.dueDate && isToday(parseISO(t.dueDate))).filter(matches).sort((a, b) => a.order - b.order);
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))).filter(matches).sort((a, b) => a.order - b.order);
  const completedToday = tasks.filter((t) => t.completed && t.dueDate && isToday(parseISO(t.dueDate))).filter(matches);

  const todayStr = format(new Date(), "EEEE, MMM d");
  const total = todayActive.length + overdue.length;

  const rescheduleAll = () => {
    const todayIso = new Date().toISOString().slice(0, 10);
    overdue.forEach((t) => update.mutate({ id: t.id, patch: { dueDate: todayIso } }));
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <ViewHeader icon={<CalendarDays className="h-6 w-6 text-[hsl(var(--ring-green))]" />} title="Today" subtitle={`${todayStr} · ${total} ${total === 1 ? "task" : "tasks"}`} />
      {overdue.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between border-b border-border pb-1.5 mb-1">
            <button onClick={() => setOverdueOpen((v) => !v)} className="flex items-center gap-1 text-sm font-semibold text-p1">
              {overdueOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              Overdue <span className="text-muted-foreground font-normal">· {overdue.length}</span>
            </button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary" onClick={rescheduleAll}>Reschedule</Button>
          </div>
          {overdueOpen && <TaskList tasks={overdue} />}
        </div>
      )}
      <div className="flex items-center justify-between border-b border-border pb-1.5 mb-1">
        <div className="text-sm font-semibold">Today <span className="text-muted-foreground font-normal">· {todayActive.length}</span></div>
        <button className="p-1 rounded hover:bg-muted text-muted-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></button>
      </div>
      {todayActive.length === 0 && overdue.length === 0 ? (
        <EmptyState icon={<CalendarDays className="h-10 w-10" />} title="You're all done for today!" description="Enjoy a clean slate. Add a task to keep the momentum." />
      ) : (
        <TaskList tasks={todayActive} />
      )}
      <AddTaskInline dueDate={new Date().toISOString().slice(0, 10)} />

      {completedToday.length > 0 && (
        <div className="mt-8">
          <button onClick={() => setCompletedOpen((v) => !v)} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
            {completedOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            Completed today · {completedToday.length}
          </button>
          {completedOpen && <div className="mt-2"><TaskList tasks={completedToday} /></div>}
        </div>
      )}
    </div>
  );
}