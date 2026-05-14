import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parseISO, addDays, nextSaturday, isToday, isTomorrow, isPast } from "date-fns";
import { Calendar as CalendarIcon, Sun, Sofa, ArrowRight, CalendarDays, X } from "lucide-react";
import { ReactNode, useState } from "react";

const toIso = (d: Date) => d.toISOString().slice(0, 10);

export function formatDueLabel(iso?: string) {
  if (!iso) return null;
  const d = parseISO(iso);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "MMM d");
}

export function dueColorClass(iso?: string) {
  if (!iso) return "text-muted-foreground";
  const d = parseISO(iso);
  if (isPast(d) && !isToday(d)) return "text-p1";
  if (isToday(d)) return "text-[hsl(var(--ring-green))]";
  if (isTomorrow(d)) return "text-p3";
  return "text-muted-foreground";
}

interface Props {
  value?: string;
  onChange: (iso: string | undefined) => void;
  trigger?: ReactNode;
  align?: "start" | "center" | "end";
}

export function DatePickerPopover({ value, onChange, trigger, align = "start" }: Props) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;

  const quick = [
    { l: "Today", icon: <Sun className="h-3.5 w-3.5 text-[hsl(var(--ring-green))]" />, get: () => new Date(), sub: format(new Date(), "EEE") },
    { l: "Tomorrow", icon: <Sun className="h-3.5 w-3.5 text-p3" />, get: () => addDays(new Date(), 1), sub: format(addDays(new Date(), 1), "EEE") },
    { l: "This weekend", icon: <Sofa className="h-3.5 w-3.5 text-primary" />, get: () => nextSaturday(new Date()), sub: format(nextSaturday(new Date()), "EEE") },
    { l: "Next week", icon: <ArrowRight className="h-3.5 w-3.5 text-p2" />, get: () => addDays(new Date(), 7), sub: format(addDays(new Date(), 7), "EEE MMM d") },
  ];

  const set = (iso: string | undefined) => {
    onChange(iso);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className={cn("h-7 text-xs gap-1", value && dueColorClass(value))}>
            <CalendarIcon className="h-3 w-3" /> {formatDueLabel(value) || "Date"}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 overflow-hidden" align={align}>
        <div className="p-2 border-b border-border">
          {quick.map((q) => (
            <button
              key={q.l}
              onClick={() => set(toIso(q.get()))}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 text-sm rounded hover:bg-muted text-left"
            >
              {q.icon}
              <span className="flex-1">{q.l}</span>
              <span className="text-xs text-muted-foreground">{q.sub}</span>
            </button>
          ))}
        </div>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => set(d ? toIso(d) : undefined)}
          initialFocus
          className={cn("p-2 pointer-events-auto")}
        />
        {value && (
          <button
            onClick={() => set(undefined)}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-xs text-muted-foreground hover:bg-muted border-t border-border"
          >
            <X className="h-3 w-3" /> No date
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { CalendarDays };