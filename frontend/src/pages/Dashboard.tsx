import { useState } from "react";
import { useTasks, useUpdateTask, useCreateTask, useProjects } from "@/hooks/use-tasks";
import { ActivityRing } from "@/features/dashboard/ActivityRing";
import { TimeTracker } from "@/features/dashboard/TimeTracker";
import { ProductivityHeatmap } from "@/features/dashboard/ProductivityHeatmap";
import { WeeklyChart } from "@/features/dashboard/WeeklyChart";
import { Plus, Hash, Flame, TrendingUp, Target } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format, isPast, isToday, parseISO, subDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const avatars = ["#db4035", "#14aaf5", "#7ecc49", "#af38eb", "#ff9933"];

export default function Dashboard() {
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const update = useUpdateTask();
  const create = useCreateTask();
  const [draft, setDraft] = useState("");

  const completed = tasks.filter((t) => t.completed).length;
  const upcomingTasks = tasks.filter((t) => !t.completed && t.dueDate && !isPast(parseISO(t.dueDate))).slice(0, 6);
  const overdueTasks = tasks.filter((t) => !t.completed && t.dueDate && isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))).slice(0, 6);
  const completedTasks = tasks.filter((t) => t.completed).slice(0, 6);
  const todoList = tasks.filter((t) => !t.completed).slice(0, 5);

  // streak: count consecutive days back from today with at least 1 completion
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = subDays(new Date(), i);
    const has = tasks.some((t) => t.completed && t.dueDate && isSameDay(parseISO(t.dueDate), d));
    if (has) streak++;
    else if (i > 0) break;
  }

  const todayDone = tasks.filter((t) => t.completed && t.dueDate && isToday(parseISO(t.dueDate))).length;
  const todayGoal = 5;

  const projectStats = projects.filter((p) => p.id !== "inbox").map((p) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    const pDone = pTasks.filter((t) => t.completed).length;
    return { ...p, total: pTasks.length, done: pDone, pct: pTasks.length ? Math.round((pDone / pTasks.length) * 100) : 0 };
  }).sort((a, b) => b.total - a.total).slice(0, 5);

  const submitTodo = () => {
    if (!draft.trim()) return;
    create.mutate({ title: draft.trim(), projectId: "inbox", priority: 4 });
    setDraft("");
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Good day, Alex 👋</h1>
          <p className="text-sm text-muted-foreground">Here's a snapshot of your week — {format(new Date(), "EEEE, MMMM d")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
            <Flame className="h-4 w-4 text-p2" />
            <div>
              <div className="text-sm font-bold leading-none">{streak} {streak === 1 ? "day" : "days"}</div>
              <div className="text-[10px] text-muted-foreground">streak</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
            <Target className="h-4 w-4 text-[hsl(var(--ring-green))]" />
            <div>
              <div className="text-sm font-bold leading-none tabular-nums">{todayDone}/{todayGoal}</div>
              <div className="text-[10px] text-muted-foreground">today's goal</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
            <TrendingUp className="h-4 w-4 text-p3" />
            <div>
              <div className="text-sm font-bold leading-none tabular-nums">{completed}</div>
              <div className="text-[10px] text-muted-foreground">total done</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Todo List */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Todo List</h3>
            <span className="text-xs text-muted-foreground">{todoList.length} active</span>
          </div>
          <div className="space-y-2">
            {todoList.map((t) => (
              <div key={t.id} className="flex items-start gap-2 group">
                <button
                  onClick={() => update.mutate({ id: t.id, patch: { completed: !t.completed } })}
                  className={cn("mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border flex items-center justify-center",
                    t.priority === 1 ? "border-p1" : t.priority === 2 ? "border-p2" : t.priority === 3 ? "border-p3" : "border-muted-foreground/40")}
                />
                <span className="text-sm leading-snug flex-1">{t.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitTodo()}
              placeholder="Create new"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Time Tracker */}
        <div className="lg:col-span-1">
          <TimeTracker />
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Activity</h3>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ActivityRing value={29} total={40} label="Working hours" sublabel="hrs" color="hsl(var(--p3))" size={96} />
            <ActivityRing value={completed} total={Math.max(tasks.length, 1)} label="Tasks" sublabel="done" color="hsl(var(--ring-green))" size={96} />
            <ActivityRing value={4} total={7} label="Projects" sublabel="active" color="hsl(var(--p2))" size={96} />
          </div>
        </div>

        {/* Assigned Tasks */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Assigned Tasks</h3>
          </div>
          <Tabs defaultValue="upcoming">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="upcoming">Upcoming ({upcomingTasks.length})</TabsTrigger>
              <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
            </TabsList>
            {[
              { v: "upcoming", list: upcomingTasks },
              { v: "overdue", list: overdueTasks },
              { v: "completed", list: completedTasks },
            ].map(({ v, list }) => (
              <TabsContent key={v} value={v} className="mt-4 space-y-3">
                {list.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">Nothing here</p>}
                {list.map((t, i) => {
                  const project = projects.find((p) => p.id === t.projectId);
                  const progress = t.completed ? 100 : 30 + ((i * 17) % 60);
                  return (
                    <motion.div key={t.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/40">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{t.title}</span>
                          {project && <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Hash className="h-3 w-3" style={{ color: project.color }} />{project.name}</span>}
                        </div>
                        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: t.priority === 1 ? "hsl(var(--p1))" : t.priority === 2 ? "hsl(var(--p2))" : "hsl(var(--p3))" }}
                          />
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {avatars.slice(0, 3).map((c, j) => (
                          <div key={j} className="h-7 w-7 rounded-full border-2 border-card flex items-center justify-center text-[10px] text-white font-semibold" style={{ background: c }}>
                            {String.fromCharCode(65 + ((i + j) % 26))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Reminder card */}
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary to-[hsl(0_72%_42%)] text-primary-foreground p-5 lg:col-span-1 flex flex-col justify-between min-h-[200px]">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-80">Reminder</p>
            <h3 className="text-lg font-semibold mt-1 leading-snug">Weekly review every Friday at 4pm</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-80">Don't forget to plan next week</span>
            <button className="text-xs font-medium bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-md">View</button>
          </div>
        </div>

        <div className="lg:col-span-2"><WeeklyChart tasks={tasks} /></div>
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Projects</h3>
          <div className="space-y-3">
            {projectStats.length === 0 && <p className="text-xs text-muted-foreground">No projects yet</p>}
            {projectStats.map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs flex items-center gap-1.5"><Hash className="h-3 w-3" style={{ color: p.color }} />{p.name}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">{p.done}/{p.total}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-full" style={{ background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3"><ProductivityHeatmap tasks={tasks} /></div>
      </div>
    </div>
  );
}