import { Priority } from "@/types";

export const priorityColor = (p: Priority) =>
  p === 1 ? "text-p1 border-p1" : p === 2 ? "text-p2 border-p2" : p === 3 ? "text-p3 border-p3" : "text-muted-foreground border-muted-foreground/40";

export const priorityFill = (p: Priority) =>
  p === 1 ? "bg-p1/10" : p === 2 ? "bg-p2/10" : p === 3 ? "bg-p3/10" : "bg-muted";

export const priorityLabel = (p: Priority) => `Priority ${p}`;