import { Menu, Search, Plus, Moon, Sun, Bell, HelpCircle } from "lucide-react";
import { useUI } from "@/store/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const tip = (label: string, kbd: string | undefined, child: React.ReactNode) => (
  <Tooltip delayDuration={300}>
    <TooltipTrigger asChild>{child}</TooltipTrigger>
    <TooltipContent side="bottom" className="text-xs">
      {label}{kbd && <span className="ml-2 opacity-70">{kbd}</span>}
    </TooltipContent>
  </Tooltip>
);

export function Topbar() {
  const { toggleSidebar, toggleTheme, theme, setQuickAdd, search, setSearch } = useUI();
  return (
    <header className="h-11 border-b border-border bg-primary text-primary-foreground flex items-center px-2 gap-1">
      {tip("Toggle sidebar", "M",
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 hover:bg-white/10 text-primary-foreground">
          <Menu className="h-4 w-4" />
        </Button>
      )}
      {tip("Add task", "Q",
        <Button variant="ghost" size="icon" onClick={() => setQuickAdd(true)} className="h-8 w-8 hover:bg-white/10 text-primary-foreground" aria-label="Quick add">
          <Plus className="h-4 w-4" />
        </Button>
      )}
      <div className="flex-1 max-w-md ml-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-70" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-7 pl-8 bg-white/10 border-transparent text-primary-foreground placeholder:text-primary-foreground/70 focus-visible:ring-white/30 focus-visible:bg-white/15"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-0.5">
        {tip("What's new", undefined,
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-primary-foreground"><Bell className="h-4 w-4" /></Button>
        )}
        {tip("Help", undefined,
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-primary-foreground"><HelpCircle className="h-4 w-4" /></Button>
        )}
        {tip(theme === "light" ? "Dark mode" : "Light mode", undefined,
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 hover:bg-white/10 text-primary-foreground">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        )}
        <div className="ml-1 h-7 w-7 rounded-full bg-gradient-to-br from-white/30 to-white/10 ring-1 ring-white/20 flex items-center justify-center text-xs font-semibold">A</div>
      </div>
    </header>
  );
}