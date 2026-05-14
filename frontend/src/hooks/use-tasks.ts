import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Task } from "@/types";
import { toast } from "sonner";

export function useTasks() {
  return useQuery({ queryKey: ["tasks"], queryFn: api.getTasks });
}
export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: api.getProjects });
}
export function useLabels() {
  return useQuery({ queryKey: ["labels"], queryFn: api.getLabels });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Task>) => api.createTask(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const prev = qc.getQueryData<Task[]>(["tasks"]) || [];
      const optimistic: Task = {
        id: "tmp_" + Math.random().toString(36).slice(2, 8),
        title: input.title || "",
        completed: false,
        priority: (input.priority as any) || 4,
        dueDate: input.dueDate,
        projectId: input.projectId || "inbox",
        labels: input.labels || [],
        order: prev.length,
        createdAt: new Date().toISOString(),
      };
      qc.setQueryData<Task[]>(["tasks"], [...prev, optimistic]);
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx && qc.setQueryData(["tasks"], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Task> }) => api.updateTask(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const prev = qc.getQueryData<Task[]>(["tasks"]) || [];
      qc.setQueryData<Task[]>(["tasks"], prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      ctx && qc.setQueryData(["tasks"], ctx.prev);
      toast.error("Couldn't update task");
    },
    onSuccess: (_d, vars) => {
      if (vars.patch.completed === true) toast.success("1 task completed. Keep up the streak! 🎯");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const prev = qc.getQueryData<Task[]>(["tasks"]) || [];
      const removed = prev.find((t) => t.id === id);
      qc.setQueryData<Task[]>(["tasks"], prev.filter((t) => t.id !== id));
      return { prev, removed };
    },
    onError: (_e, _v, ctx) => {
      ctx && qc.setQueryData(["tasks"], ctx.prev);
      toast.error("Couldn't delete task");
    },
    onSuccess: (_d, _v, ctx) => {
      toast("Task deleted", {
        action: ctx?.removed ? {
          label: "Undo",
          onClick: async () => {
            if (!ctx.removed) return;
            await api.createTask(ctx.removed);
            qc.invalidateQueries({ queryKey: ["tasks"] });
          },
        } : undefined,
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}