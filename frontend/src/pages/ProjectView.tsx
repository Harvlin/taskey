import { Hash, ChevronDown, ChevronRight, MoreHorizontal, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProjects, useTasks } from "@/hooks/use-tasks";
import { TaskList } from "@/features/tasks/TaskList";
import { AddTaskInline } from "@/features/tasks/AddTaskInline";
import { ViewHeader } from "@/components/ViewHeader";
import { EmptyState } from "@/components/EmptyState";
import { useUI } from "@/store/ui";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function ProjectView() {
  const { id = "" } = useParams();
  const { data: projects = [] } = useProjects();
  const { data: tasks = [] } = useTasks();
  const search = useUI((s) => s.search);
  const project = projects.find((p) => p.id === id);
  const all = tasks.filter((t) => t.projectId === id)
    .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()));
  const active = all.filter((t) => !t.completed).sort((a, b) => a.order - b.order);
  const done = all.filter((t) => t.completed);
  const [completedOpen, setCompletedOpen] = useState(false);

  if (!project) return <div className="p-8">Project not found</div>;
  const pct = all.length === 0 ? 0 : Math.round((done.length / all.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <ViewHeader
        icon={<Hash className="h-6 w-6" style={{ color: project.color }} />}
        title={project.name}
        subtitle={`${active.length} active · ${done.length} completed`}
        right={project.favorite ? <Star className="h-4 w-4 text-p2 fill-p2" /> : undefined}
      />
      {all.length > 0 && (
        <div className="mb-5 flex items-center gap-3">
          <Progress value={pct} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">{pct}%</span>
        </div>
      )}
      {active.length === 0 && done.length === 0 ? (
        <EmptyState title="No tasks yet" description="Add your first task to get started." />
      ) : (
        <TaskList tasks={active} />
      )}
      <AddTaskInline projectId={project.id} />
      {done.length > 0 && (
        <div className="mt-8">
          <button onClick={() => setCompletedOpen((v) => !v)} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
            {completedOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            Completed · {done.length}
          </button>
          {completedOpen && <div className="mt-2"><TaskList tasks={done} /></div>}
        </div>
      )}
    </div>
  );
}