import { Task } from "@/types";
import { motion } from "framer-motion";
import { format, subDays, parseISO, isSameDay } from "date-fns";

export function WeeklyChart({ tasks }: { tasks: Task[] }) {
  const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
  const data = days.map((d) => ({
    label: format(d, "EEE"),
    completed: tasks.filter((t) => t.completed && t.dueDate && isSameDay(parseISO(t.dueDate), d)).length,
    added: tasks.filter((t) => isSameDay(parseISO(t.createdAt), d)).length,
    isToday: isSameDay(d, new Date()),
  }));
  const max = Math.max(...data.flatMap((d) => [d.completed, d.added]), 5);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">This week</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Tasks added vs completed</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary" />Done</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-muted-foreground/40" />Added</span>
        </div>
      </div>
      <div className="flex items-end gap-3 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-end gap-1 h-full w-full justify-center">
              <motion.div initial={{ height: 0 }} animate={{ height: `${(d.added / max) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.04 }}
                className="w-2.5 rounded-t bg-muted-foreground/30 min-h-[2px]" />
              <motion.div initial={{ height: 0 }} animate={{ height: `${(d.completed / max) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.04 + 0.1 }}
                className="w-2.5 rounded-t bg-primary min-h-[2px]" />
            </div>
            <span className={`text-[10px] ${d.isToday ? "font-semibold text-primary" : "text-muted-foreground"}`}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
