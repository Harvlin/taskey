import { NavLink, useLocation } from "react-router-dom";
import { Inbox, CalendarDays, Calendar, Filter, ChevronDown, ChevronRight, Plus, Hash, LayoutDashboard, Star, Search } from "lucide-react";
import { useUI } from "@/store/ui";
import { useProjects, useTasks } from "@/hooks/use-tasks";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isToday, parseISO } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const collapsed = useUI((s) => s.sidebarCollapsed);
  const { data: projects = [] } = useProjects();
  const { data: tasks = [] } = useTasks();
  const [openProjects, setOpenProjects] = useState(true);
  const [openFav, setOpenFav] = useState(true);
  const location = useLocation();

  const inboxCount = tasks.filter((t) => t.projectId === "inbox" && !t.completed).length;
  const todayCount = tasks.filter((t) => !t.completed && t.dueDate && isToday(parseISO(t.dueDate))).length;

  const projectCount = (id: string) => tasks.filter((t) => t.projectId === id && !t.completed).length;

  const navItem = (to: string, icon: React.ReactNode, label: string, count?: number, color?: string) => {
    const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
    const inner = (
      <NavLink
        to={to}
        className={cn(
          "relative flex items-center gap-3 px-3 py-1.5 mx-2 rounded-md text-[13.5px] transition-colors",
          "hover:bg-sidebar-hover",
          active && "bg-sidebar-active text-foreground font-semibold"
        )}
      >
        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary" />}
        <span className="w-4 flex justify-center" style={color ? { color } : undefined}>{icon}</span>
        {!collapsed && <span className="flex-1 truncate">{label}</span>}
        {!collapsed && count !== undefined && count > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
        )}
      </NavLink>
    );
    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{inner}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      );
    }
    return inner;
  };

  const favorites = projects.filter((p) => p.favorite);
  const setQuickAdd = useUI((s) => s.setQuickAdd);

  return (
    <aside
      className={cn(
        "shrink-0 bg-sidebar text-sidebar-foreground border-r border-border h-full overflow-y-auto scrollbar-thin transition-[width] duration-200",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <div className="py-3 space-y-0.5">
        {!collapsed && (
          <button
            onClick={() => setQuickAdd(true)}
            className="mx-3 mb-3 flex items-center gap-2 text-sm font-medium text-primary hover:opacity-90 group"
          >
            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-transform group-hover:scale-110">
              <Plus className="h-3.5 w-3.5" />
            </span>
            Add task
            <span className="ml-auto text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">Q</span>
          </button>
        )}
        {navItem("/inbox", <Inbox className="h-4 w-4" />, "Inbox", inboxCount, "hsl(var(--p3))")}
        {navItem("/today", <CalendarDays className="h-4 w-4" />, "Today", todayCount, "hsl(var(--ring-green))")}
        {navItem("/upcoming", <Calendar className="h-4 w-4" />, "Upcoming", undefined, "hsl(var(--p2))")}
        {navItem("/filters", <Filter className="h-4 w-4" />, "Filters & Labels")}
        {navItem("/dashboard", <LayoutDashboard className="h-4 w-4" />, "Dashboard", undefined, "hsl(var(--p1))")}

        {!collapsed && favorites.length > 0 && (
          <div className="mt-5">
            <button
              onClick={() => setOpenFav((v) => !v)}
              className="w-full flex items-center gap-1 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
            >
              {openFav ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <Star className="h-3 w-3" /> Favorites
            </button>
            {openFav &&
              favorites.map((p) =>
                navItem(`/project/${p.id}`, <Hash className="h-4 w-4" style={{ color: p.color }} />, p.name, projectCount(p.id))
              )}
          </div>
        )}

        {!collapsed && (
          <div className="mt-5">
            <button
              onClick={() => setOpenProjects((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground group"
            >
              <span className="flex items-center gap-1">
                {openProjects ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                My Projects
              </span>
              <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </button>
            {openProjects &&
              projects
                .filter((p) => p.id !== "inbox")
                .map((p) =>
                  navItem(`/project/${p.id}`, <Hash className="h-4 w-4" style={{ color: p.color }} />, p.name, projectCount(p.id))
                )}
          </div>
        )}
      </div>
    </aside>
  );
}