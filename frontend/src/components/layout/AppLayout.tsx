import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { QuickAddModal } from "@/features/tasks/QuickAddModal";
import { TaskDetailDrawer } from "@/features/tasks/TaskDetailDrawer";
import { useEffect } from "react";
import { useUI } from "@/store/ui";

export default function AppLayout() {
  const setQuickAdd = useUI((s) => s.setQuickAdd);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inField = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (!inField && e.key.toLowerCase() === "q") {
        e.preventDefault();
        setQuickAdd(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setQuickAdd]);

  return (
    <div className="h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto bg-background scrollbar-thin">
          <Outlet />
        </main>
      </div>
      <QuickAddModal />
      <TaskDetailDrawer />
    </div>
  );
}