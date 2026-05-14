import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useEffect } from "react";

export function ProtectedRoute() {
  const { token, status, hydrate } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (token && status === "idle") void hydrate();
  }, [token, status, hydrate]);

  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const token = useAuth((s) => s.token);
  if (token) return <Navigate to="/today" replace />;
  return <Outlet />;
}