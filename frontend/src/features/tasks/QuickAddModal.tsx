import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUI } from "@/store/ui";
import { useState, useEffect } from "react";
import { useCreateTask, useProjects } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Flag, Hash } from "lucide-react";
import { Priority } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DatePickerPopover } from "@/components/DatePickerPopover";

export function QuickAddModal() {
  const { quickAddOpen, setQuickAdd } = useUI();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Priority>(4);
  const [projectId, setProjectId] = useState("inbox");
  const [dueDate, setDueDate] = useState<string | undefined>();
  const create = useCreateTask();
  const { data: projects = [] } = useProjects();

  useEffect(() => {
    if (!quickAddOpen) { setTitle(""); setDesc(""); setPriority(4); setProjectId("inbox"); setDueDate(undefined); }
  }, [quickAddOpen]);

  const submit = () => {
    if (!title.trim()) return;
    create.mutate({ title: title.trim(), description: desc.trim() || undefined, priority, projectId, dueDate });
    setQuickAdd(false);
  };

  const project = projects.find((p) => p.id === projectId);
  const pColor = priority === 1 ? "text-p1" : priority === 2 ? "text-p2" : priority === 3 ? "text-p3" : "text-muted-foreground";

  return (
    <Dialog open={quickAddOpen} onOpenChange={setQuickAdd}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Add task</DialogTitle>
        <div className="p-4">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") setQuickAdd(false); }}
            placeholder="Task name"
            className="w-full bg-transparent outline-none text-base font-medium"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="w-full bg-transparent outline-none text-sm text-muted-foreground mt-1"
          />
          <div className="flex flex-wrap gap-2 mt-4">
            <DatePickerPopover value={dueDate} onChange={setDueDate} />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Hash className="h-3.5 w-3.5 mr-1" style={{ color: project?.color }} /> {project?.name}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1">
                {projects.map((p) => (
                  <button key={p.id} onClick={() => setProjectId(p.id)} className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5" style={{ color: p.color }} /> {p.name}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("h-8 text-xs", pColor)}>
                  <Flag className="h-3.5 w-3.5 mr-1" /> P{priority}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-1">
                {([1, 2, 3, 4] as Priority[]).map((p) => (
                  <button key={p} onClick={() => setPriority(p)} className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted flex items-center gap-2">
                    <Flag className={cn("h-3.5 w-3.5", p === 1 ? "text-p1" : p === 2 ? "text-p2" : p === 3 ? "text-p3" : "text-muted-foreground")} /> Priority {p}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-border bg-muted/30">
          <Button variant="ghost" size="sm" onClick={() => setQuickAdd(false)}>Cancel</Button>
          <Button size="sm" onClick={submit} disabled={!title.trim()}>Add task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}