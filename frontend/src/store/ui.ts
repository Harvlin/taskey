import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  theme: "light" | "dark";
  sidebarCollapsed: boolean;
  quickAddOpen: boolean;
  detailTaskId: string | null;
  search: string;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setQuickAdd: (v: boolean) => void;
  setDetailTask: (id: string | null) => void;
  setSearch: (v: string) => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      theme: "light",
      sidebarCollapsed: false,
      quickAddOpen: false,
      detailTaskId: null,
      search: "",
      toggleTheme: () =>
        set((s) => {
          const t = s.theme === "light" ? "dark" : "light";
          document.documentElement.classList.toggle("dark", t === "dark");
          return { theme: t };
        }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setQuickAdd: (v) => set({ quickAddOpen: v }),
      setDetailTask: (id) => set({ detailTaskId: id }),
      setSearch: (v) => set({ search: v }),
    }),
    { name: "todoist_ui" }
  )
);

// init theme
if (typeof document !== "undefined") {
  const stored = localStorage.getItem("todoist_ui");
  try {
    const parsed = stored ? JSON.parse(stored) : null;
    if (parsed?.state?.theme === "dark") document.documentElement.classList.add("dark");
  } catch {}
}