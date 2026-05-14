import { Plus, Flag, Hash } from "lucide-react";
import { useState } from "react";
import { useCreateTask, useProjects } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Priority } from "@/types";
import { cn } from "@/lib/utils";
import { DatePickerPopover } from "@/components/DatePickerPopover";

export function AddTaskInline({ projectId, dueDate }: { projectId?: string; dueDate?: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Priority>(4);
  const [date, setDate] = useState<string | undefined>(dueDate);
  const [pid, setPid] = useState<string>(projectId || "inbox");
  const create = useCreateTask();
  const { data: projects = [] } = useProjects();

  const submit = () => {
    if (!title.trim()) return;
    create.mutate({ title: title.trim(), description: desc.trim() || undefined, projectId: pid, dueDate: date, priority });
    setTitle("");
    setDesc("");
    setPriority(4);
    setDate(dueDate);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="group mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-p1 px-1 py-2 w-full"
      >
        <span className="h-5 w-5 rounded-full flex items-center justify-center text-p1 group-hover:bg-p1 group-hover:text-primary-foreground transition-colors">
          <Plus className="h-3.5 w-3.5" />
        </span>
        <span>Add task</span>
      </button>
    );
  }

  const project = projects.find((p) => p.id === pid);
  const pColor = priority === 1 ? "text-p1 border-p1/40" : priority === 2 ? "text-p2 border-p2/40" : priority === 3 ? "text-p3 border-p3/40" : "text-muted-foreground";

  return (
    <div className="mt-2 border border-border rounded-lg p-3 bg-card animate-fade-in">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { submit(); } if (e.key === "Escape") { setOpen(false); } }}
        placeholder="Task name"
        className="w-full bg-transparent outline-none text-sm font-medium"
      />
      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description"
        className="w-full bg-transparent outline-none text-sm text-muted-foreground mt-1"
      />
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <DatePickerPopover value={date} onChange={setDate} />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-7 text-xs gap-1", pColor)}>
              <Flag className="h-3 w-3" /> P{priority}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-1">
            {([1, 2, 3, 4] as Priority[]).map((p) => (
              <button key={p} onClick={() => setPriority(p)} className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted flex items-center gap-2">
                <Flag className={cn("h-3.5 w-3.5", p === 1 ? "text-p1" : p === 2 ? "text-p2" : p === 3 ? "text-p3" : "text-muted-foreground")} /> Priority {p}
              </button>
            ))}
          </PopoverContent>
        </Popover>
        {!projectId && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <Hash className="h-3 w-3" style={{ color: project?.color }} /> {project?.name}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-1">
              {projects.map((p) => (
                <button key={p.id} onClick={() => setPid(p.id)} className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5" style={{ color: p.color }} /> {p.name}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}
        <div className="ml-auto flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => { setOpen(false); setTitle(""); }}>Cancel</Button>
        <Button size="sm" onClick={submit} disabled={!title.trim()}>Add task</Button>
        </div>
      </div>
    </div>
  );
}