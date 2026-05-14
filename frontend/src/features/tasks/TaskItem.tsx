import { useState } from "react";
import { Task, Priority } from "@/types";
import { useDeleteTask, useUpdateTask, useProjects } from "@/hooks/use-tasks";
import { MoreHorizontal, Trash2, Edit2, MessageSquare, Hash, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUI } from "@/store/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DatePickerPopover, formatDueLabel, dueColorClass } from "@/components/DatePickerPopover";
import { Calendar as CalendarIcon } from "lucide-react";

export function TaskItem({ task }: { task: Task }) {
  const update = useUpdateTask();
  const del = useDeleteTask();
  const setDetail = useUI((s) => s.setDetailTask);
  const { data: projects = [] } = useProjects();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const project = projects.find((p) => p.id === task.projectId);

  const dot = task.priority === 1 ? "border-p1 bg-p1/10 hover:bg-p1/20" : task.priority === 2 ? "border-p2 bg-p2/10 hover:bg-p2/20" : task.priority === 3 ? "border-p3 bg-p3/10 hover:bg-p3/20" : "border-muted-foreground/40 hover:bg-muted";
  const check = task.priority === 1 ? "text-p1" : task.priority === 2 ? "text-p2" : task.priority === 3 ? "text-p3" : "text-muted-foreground";
  const pBadge = task.priority === 1 ? "text-p1 bg-p1/10 border-p1/30" : task.priority === 2 ? "text-p2 bg-p2/10 border-p2/30" : task.priority === 3 ? "text-p3 bg-p3/10 border-p3/30" : "";

  const save = () => {
    setEditing(false);
    if (title.trim() && title !== task.title) update.mutate({ id: task.id, patch: { title: title.trim() } });
    else setTitle(task.title);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="group flex items-start gap-3 py-2.5 px-1 border-b border-border/60 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => !editing && setDetail(task.id)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          update.mutate({ id: task.id, patch: { completed: !task.completed } });
        }}
        className={cn(
          "shrink-0 mt-0.5 h-[18px] w-[18px] rounded-full border flex items-center justify-center transition-all active:scale-90",
          dot,
          task.completed && "bg-muted-foreground/20 border-muted-foreground"
        )}
        aria-label="Toggle complete"
      >
        {task.completed && (
          <svg className={cn("h-3 w-3", check)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") { setTitle(task.title); setEditing(false); }
            }}
            className="w-full bg-transparent border-b border-primary outline-none text-sm py-0.5"
          />
        ) : (
          <div className={cn("text-sm leading-snug", task.completed && "line-through text-muted-foreground")}>{task.title}</div>
        )}
        {task.description && <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{task.description}</div>}
        <div className="flex items-center gap-3 mt-1" onClick={(e) => e.stopPropagation()}>
          <DatePickerPopover
            value={task.dueDate}
            onChange={(iso) => update.mutate({ id: task.id, patch: { dueDate: iso } })}
            trigger={
              <button className={cn("hover:bg-muted rounded px-1 -mx-1 py-0.5 transition-colors inline-flex items-center gap-1 text-xs", task.dueDate ? dueColorClass(task.dueDate) : "text-muted-foreground/70 opacity-0 group-hover:opacity-100")}>
                <CalendarIcon className="h-3 w-3" /> {formatDueLabel(task.dueDate) || "Schedule"}
              </button>
            }
          />
          {task.priority !== 4 && (
            <span className={cn("inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide border rounded px-1.5 py-0.5", pBadge)}>
              <Flag className="h-2.5 w-2.5" /> P{task.priority}
            </span>
          )}
          {project && project.id !== "inbox" && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" style={{ color: project.color }} />
              {project.name}
            </span>
          )}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-muted text-muted-foreground" aria-label="Edit"><Edit2 className="h-3.5 w-3.5" /></button>
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 rounded hover:bg-muted text-muted-foreground" aria-label="Priority"><Flag className={cn("h-3.5 w-3.5", check)} /></button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-1">
            {([1, 2, 3, 4] as Priority[]).map((p) => (
              <button key={p} onClick={() => update.mutate({ id: task.id, patch: { priority: p } })} className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted flex items-center gap-2">
                <Flag className={cn("h-3.5 w-3.5", p === 1 ? "text-p1" : p === 2 ? "text-p2" : p === 3 ? "text-p3" : "text-muted-foreground")} /> Priority {p}
              </button>
            ))}
          </PopoverContent>
        </Popover>
        <button onClick={() => setDetail(task.id)} className="p-1 rounded hover:bg-muted text-muted-foreground" aria-label="Comments"><MessageSquare className="h-3.5 w-3.5" /></button>
        <button onClick={() => del.mutate(task.id)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-p1" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
        <button className="p-1 rounded hover:bg-muted text-muted-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></button>
      </div>
    </motion.div>
  );
}