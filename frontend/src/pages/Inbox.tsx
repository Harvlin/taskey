import { Inbox as InboxIcon } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { TaskList } from "@/features/tasks/TaskList";
import { AddTaskInline } from "@/features/tasks/AddTaskInline";
import { ViewHeader } from "@/components/ViewHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { useUI } from "@/store/ui";

export default function Inbox() {
  const { data: tasks, isLoading } = useTasks();
  const search = useUI((s) => s.search);
  const filtered = (tasks || [])
    .filter((t) => t.projectId === "inbox")
    .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => Number(a.completed) - Number(b.completed) || a.order - b.order);

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <ViewHeader icon={<InboxIcon className="h-6 w-6 text-p3" />} title="Inbox" />
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<InboxIcon className="h-10 w-10" />} title="Your Inbox is empty" description="Capture quick tasks here, then organize them later." />
      ) : (
        <TaskList tasks={filtered} />
      )}
      <AddTaskInline projectId="inbox" />
    </div>
  );
}