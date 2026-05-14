import { useEffect, useRef, useState } from "react";
import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "todoist_timer";

function fmt(sec: number) {
  const h = Math.floor(sec / 3600).toString().padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function TimeTracker() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const { seconds, running, startedAt } = JSON.parse(raw);
        let s = seconds;
        if (running && startedAt) s += Math.floor((Date.now() - startedAt) / 1000);
        setSeconds(s);
        setRunning(running);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ seconds, running, startedAt: running ? Date.now() : null }));
  }, [seconds, running]);

  return (
    <div className="rounded-xl border border-border p-5 bg-card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold">Time Tracker</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${running ? "bg-[hsl(var(--ring-green))]/15 text-[hsl(var(--ring-green))]" : "bg-muted text-muted-foreground"}`}>
          {running ? "Running" : "Idle"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Focus session</p>
      <div className="font-mono text-4xl font-bold tracking-tight tabular-nums text-center my-4">{fmt(seconds)}</div>
      <div className="flex items-center justify-center gap-2">
        {!running ? (
          <Button size="sm" onClick={() => setRunning(true)} className="gap-1"><Play className="h-3.5 w-3.5" />Start</Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => setRunning(false)} className="gap-1"><Pause className="h-3.5 w-3.5" />Pause</Button>
        )}
        <Button size="sm" variant="outline" onClick={() => { setRunning(false); setSeconds(0); }} className="gap-1"><Square className="h-3.5 w-3.5" />Stop</Button>
      </div>
    </div>
  );
}