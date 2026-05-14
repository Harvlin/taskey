import { Link } from "react-router-dom";
import { ArrowRight, Check, CalendarDays, BarChart3, Zap, Inbox, Keyboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Inbox, title: "Capture everything", body: "A frictionless inbox so nothing falls through the cracks." },
  { icon: CalendarDays, title: "Plan your day", body: "Today and Upcoming views built around how you actually work." },
  { icon: BarChart3, title: "See your progress", body: "A native analytics dashboard with streaks, heatmaps and goals." },
  { icon: Zap, title: "Built for speed", body: "Optimistic updates, keyboard shortcuts, instant search." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground grid place-items-center text-xs font-bold">T</span>
            <span>Tasksy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
            <Button asChild size="sm"><Link to="/signup">Get started</Link></Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, hsl(var(--primary)/0.18), transparent 40%), radial-gradient(circle at 80% 10%, hsl(var(--p3)/0.15), transparent 40%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-6">
            <Sparkles className="h-3 w-3 text-primary" /> New — Productivity dashboard
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] max-w-3xl mx-auto">
            The calmest way to <span className="text-primary">get things done</span>.
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            A focused task manager for people who want clarity, not clutter. Capture, plan, and finish — without the noise.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-6">
              <Link to="/signup">Start for free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Free forever for individuals · No credit card required</p>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="rounded-xl border border-border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="h-9 border-b border-border bg-muted/40 flex items-center gap-1.5 px-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-p2/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              <span className="ml-3 text-[11px] text-muted-foreground">tasksy.app / today</span>
            </div>
            <div className="grid grid-cols-[180px_1fr] min-h-[320px]">
              <div className="border-r border-border bg-sidebar p-3 space-y-1.5 text-[12.5px]">
                <div className="flex items-center gap-2 px-2 py-1 rounded text-primary font-medium">
                  <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px]">+</span> Add task
                </div>
                <div className="px-2 py-1 rounded">Inbox</div>
                <div className="px-2 py-1 rounded bg-sidebar-active font-medium">Today</div>
                <div className="px-2 py-1 rounded">Upcoming</div>
                <div className="px-2 py-1 rounded">Dashboard</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1">Today</h3>
                <p className="text-xs text-muted-foreground mb-4">5 tasks</p>
                <ul className="space-y-2.5 text-sm">
                  {[
                    { t: "Review pull requests", d: true, p: "border-p1" },
                    { t: "Write Q3 launch specs", d: false, p: "border-p2" },
                    { t: "Morning run – 5km", d: false, p: "border-p3" },
                    { t: "Reply to design feedback", d: false, p: "border-p3" },
                    { t: "Read 30 pages", d: false, p: "border-p4" },
                  ].map((x, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className={`h-4 w-4 rounded-full border-2 grid place-items-center ${x.d ? "bg-primary border-primary" : x.p}`}>
                        {x.d && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                      </span>
                      <span className={x.d ? "line-through text-muted-foreground" : ""}>{x.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Designed to disappear.</h2>
            <p className="mt-3 text-muted-foreground">Every detail is tuned to keep you in flow. No ads. No nagging. No bloat.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
            {features.map((f) => (
              <div key={f.title} className="bg-card p-7">
                <f.icon className="h-5 w-5 text-primary mb-4" />
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">A keyboard-first workflow.</h2>
            <p className="mt-3 text-muted-foreground">
              Hit <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border border-border">Q</kbd> from anywhere to capture a task. Natural-language dates, priorities, projects — all inline.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Quick add with natural language", "Optimistic updates that feel instant", "Drag to reorder, click to edit", "Dark mode that looks great"].map((s) => (
                <li key={s} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 font-mono text-[13px] leading-relaxed shadow-sm">
            <div className="text-muted-foreground mb-3 flex items-center gap-1.5"><Keyboard className="h-3.5 w-3.5" /> Quick add</div>
            <div className="space-y-1">
              <div><span className="text-foreground">Ship release notes</span> <span className="text-p3">tomorrow 9am</span> <span className="text-p1">!p1</span> <span className="text-primary">#work</span></div>
              <div><span className="text-foreground">Call the dentist</span> <span className="text-p3">monday</span> <span className="text-p2">!p2</span></div>
              <div><span className="text-foreground">Buy groceries</span> <span className="text-p3">today</span> <span className="text-primary">#personal</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-border bg-muted/20">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Start your calmest week yet.</h2>
          <p className="mt-3 text-muted-foreground">Free for individuals. Forever.</p>
          <Button asChild size="lg" className="mt-7 h-11 px-6">
            <Link to="/signup">Create your account <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Tasksy</span>
          <span>Crafted with care.</span>
        </div>
      </footer>
    </div>
  );
}