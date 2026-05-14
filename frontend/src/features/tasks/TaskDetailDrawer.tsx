import { useUI } from "@/store/ui";
import { useTasks, useUpdateTask, useProjects } from "@/hooks/use-tasks";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Flag, Hash } from "lucide-react";
import { Priority } from "@/types";
import { cn } from "@/lib/utils";
import { DatePickerPopover, formatDueLabel, dueColorClass } from "@/components/DatePickerPopover";
import { Calendar as CalendarIcon } from "lucide-react";

export function TaskDetailDrawer() {
  const { detailTaskId, setDetailTask } = useUI();
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const update = useUpdateTask();
  const task = tasks.find((t) => t.id === detailTaskId);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => { if (task) { setTitle(task.title); setDesc(task.description || ""); } }, [task?.id]);

  if (!task) return null;
  const project = projects.find((p) => p.id === task.projectId);
  const pColor = task.priority === 1 ? "text-p1" : task.priority === 2 ? "text-p2" : task.priority === 3 ? "text-p3" : "text-muted-foreground";

  return (
    <Sheet open={!!detailTaskId} onOpenChange={(v) => !v && setDetailTask(null)}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-5 pt-5 pb-2">
          <SheetTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Hash className="h-3.5 w-3.5" style={{ color: project?.color }} />
            {project?.name}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5 py-3 scrollbar-thin">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title.trim() && title !== task.title && update.mutate({ id: task.id, patch: { title: title.trim() } })}
            className="w-full bg-transparent outline-none text-lg font-semibold leading-tight"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onBlur={() => desc !== (task.description || "") && update.mutate({ id: task.id, patch: { description: desc } })}
            placeholder="Description"
            rows={3}
            className="w-full bg-transparent outline-none text-sm text-muted-foreground mt-2 resize-none"
          />
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Due date</span>
              <DatePickerPopover
                value={task.dueDate}
                onChange={(iso) => update.mutate({ id: task.id, patch: { dueDate: iso } })}
                align="end"
                trigger={
                  <Button variant="ghost" size="sm" className={cn("h-7 gap-1.5", task.dueDate ? dueColorClass(task.dueDate) : "text-muted-foreground")}>
                    <CalendarIcon className="h-3.5 w-3.5" /> {formatDueLabel(task.dueDate) || "Set date"}
                  </Button>
                }
              />
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Priority</span>
              <div className="flex gap-1">
                {([1, 2, 3, 4] as Priority[]).map((p) => (
                  <button key={p} onClick={() => update.mutate({ id: task.id, patch: { priority: p } })}
                    className={cn("h-7 w-7 rounded flex items-center justify-center hover:bg-muted",
                      task.priority === p && "bg-muted")}>
                    <Flag className={cn("h-4 w-4", p === 1 ? "text-p1" : p === 2 ? "text-p2" : p === 3 ? "text-p3" : "text-muted-foreground")} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Button variant="outline" size="sm" onClick={() => update.mutate({ id: task.id, patch: { completed: !task.completed } })} className={cn(pColor)}>
                {task.completed ? "Reopen" : "Mark complete"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}