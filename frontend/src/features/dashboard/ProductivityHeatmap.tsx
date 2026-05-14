import { Task } from "@/types";
import { format, subDays, parseISO, isSameDay } from "date-fns";

export function ProductivityHeatmap({ tasks }: { tasks: Task[] }) {
  const days = Array.from({ length: 84 }, (_, i) => subDays(new Date(), 83 - i));
  const completedByDay = days.map((d) => tasks.filter((t) => t.completed && t.dueDate && isSameDay(parseISO(t.dueDate), d)).length);
  const max = Math.max(...completedByDay, 4);
  const total = completedByDay.reduce((a, b) => a + b, 0);

  // group into weeks of 7 (12 columns)
  const cols = 12;
  const grid: number[][] = Array.from({ length: cols }, () => []);
  completedByDay.forEach((v, i) => grid[Math.floor(i / 7)].push(v));

  const intensity = (v: number) => {
    if (v === 0) return "bg-muted/60";
    const r = v / max;
    if (r < 0.25) return "bg-primary/20";
    if (r < 0.5) return "bg-primary/40";
    if (r < 0.75) return "bg-primary/60";
    return "bg-primary";
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Productivity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{total} tasks completed in the last 12 weeks</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>Less</span>
          {["bg-muted/60", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"].map((c, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="flex gap-1">
        {grid.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((v, j) => (
              <div key={j} className={`h-3 w-3 rounded-sm ${intensity(v)}`} title={`${format(days[i * 7 + j], "MMM d")}: ${v} done`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
