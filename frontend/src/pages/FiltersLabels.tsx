import { Filter, Tag, Flag, CheckCircle2, Star, Hash } from "lucide-react";
import { useLabels, useTasks, useProjects } from "@/hooks/use-tasks";
import { ViewHeader } from "@/components/ViewHeader";
import { Link, useSearchParams } from "react-router-dom";
import { TaskList } from "@/features/tasks/TaskList";
import { EmptyState } from "@/components/EmptyState";

export default function FiltersLabels() {
  const { data: labels = [] } = useLabels();
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const [params, setParams] = useSearchParams();
  const active = params.get("f");
  const activeLabel = params.get("l");

  const filters = [
    { id: "p1", name: "Priority 1", icon: Flag, count: tasks.filter((t) => t.priority === 1 && !t.completed).length, color: "hsl(var(--p1))" },
    { id: "p2", name: "Priority 2", icon: Flag, count: tasks.filter((t) => t.priority === 2 && !t.completed).length, color: "hsl(var(--p2))" },
    { id: "p3", name: "Priority 3", icon: Flag, count: tasks.filter((t) => t.priority === 3 && !t.completed).length, color: "hsl(var(--p3))" },
    { id: "favorites", name: "Favorites", icon: Star, count: tasks.filter((t) => !t.completed && projects.find((p) => p.id === t.projectId)?.favorite).length, color: "hsl(var(--p2))" },
    { id: "no-date", name: "No date", icon: Filter, count: tasks.filter((t) => !t.completed && !t.dueDate).length, color: "hsl(var(--p3))" },
    { id: "completed", name: "Completed", icon: CheckCircle2, count: tasks.filter((t) => t.completed).length, color: "hsl(var(--ring-green))" },
  ];

  let viewTasks: typeof tasks = [];
  let viewTitle = "";
  if (active) {
    const f = filters.find((x) => x.id === active);
    viewTitle = f?.name || "";
    viewTasks = tasks.filter((t) => {
      if (active === "p1") return t.priority === 1 && !t.completed;
      if (active === "p2") return t.priority === 2 && !t.completed;
      if (active === "p3") return t.priority === 3 && !t.completed;
      if (active === "favorites") return !t.completed && projects.find((p) => p.id === t.projectId)?.favorite;
      if (active === "no-date") return !t.completed && !t.dueDate;
      if (active === "completed") return t.completed;
      return false;
    });
  } else if (activeLabel) {
    const l = labels.find((x) => x.id === activeLabel);
    viewTitle = l ? `@${l.name}` : "";
    viewTasks = tasks.filter((t) => t.labels.includes(activeLabel));
  }

  if (active || activeLabel) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-8">
        <button onClick={() => setParams({})} className="text-xs text-muted-foreground hover:text-foreground mb-3">← Filters & Labels</button>
        <ViewHeader icon={<Filter className="h-6 w-6 text-primary" />} title={viewTitle} subtitle={`${viewTasks.length} ${viewTasks.length === 1 ? "task" : "tasks"}`} />
        {viewTasks.length === 0 ? <EmptyState title="No tasks match" description="Try a different filter or label." /> : <TaskList tasks={viewTasks} />}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
      <ViewHeader icon={<Filter className="h-6 w-6" />} title="Filters & Labels" subtitle="Slice your tasks any way you like" />
      <section>
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <Link to={`?f=${f.id}`} key={f.id} className="group border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all flex items-center gap-3 bg-card">
                <span className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: `${f.color}1f` }}>
                  <Icon className="h-4 w-4" style={{ color: f.color }} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.count} {f.count === 1 ? "task" : "tasks"}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Labels</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {labels.map((l) => (
            <Link to={`?l=${l.id}`} key={l.id} className="border border-border rounded-xl p-4 flex items-center gap-3 hover:border-primary/40 hover:shadow-sm transition-all bg-card">
              <span className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: `${l.color}1f` }}>
                <Tag className="h-4 w-4" style={{ color: l.color }} />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">@{l.name}</div>
                <div className="text-xs text-muted-foreground">{tasks.filter((t) => t.labels.includes(l.id)).length} tasks</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Projects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {projects.filter((p) => p.id !== "inbox").map((p) => (
            <Link to={`/project/${p.id}`} key={p.id} className="border border-border rounded-xl p-4 flex items-center gap-3 hover:border-primary/40 hover:shadow-sm transition-all bg-card">
              <Hash className="h-4 w-4" style={{ color: p.color }} />
              <div className="flex-1">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{tasks.filter((t) => t.projectId === p.id && !t.completed).length} active</div>
              </div>
              {p.favorite && <Star className="h-3.5 w-3.5 text-p2 fill-p2" />}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}