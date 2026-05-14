import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound.tsx";
import AppLayout from "./components/layout/AppLayout";
import Inbox from "./pages/Inbox";
import Today from "./pages/Today";
import Upcoming from "./pages/Upcoming";
import ProjectView from "./pages/ProjectView";
import FiltersLabels from "./pages/FiltersLabels";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/today" element={<Today />} />
              <Route path="/upcoming" element={<Upcoming />} />
              <Route path="/filters" element={<FiltersLabels />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/project/:id" element={<ProjectView />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
