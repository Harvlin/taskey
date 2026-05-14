import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, AuthUser } from "@/services/api";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      status: "idle",
      error: null,
      async login(email, password) {
        set({ status: "loading", error: null });
        try {
          const { token, user } = await api.login(email, password);
          set({ token, user, status: "authenticated", error: null });
        } catch (e: any) {
          set({ status: "unauthenticated", error: e?.message || "Login failed" });
          throw e;
        }
      },
      async register(name, email, password) {
        set({ status: "loading", error: null });
        try {
          const { token, user } = await api.register(name, email, password);
          set({ token, user, status: "authenticated", error: null });
        } catch (e: any) {
          set({ status: "unauthenticated", error: e?.message || "Sign up failed" });
          throw e;
        }
      },
      logout() {
        set({ token: null, user: null, status: "unauthenticated", error: null });
      },
      async hydrate() {
        const { token } = get();
        if (!token) { set({ status: "unauthenticated" }); return; }
        try {
          const user = await api.me();
          set({ user, status: "authenticated" });
        } catch {
          // Token invalid — but in mock mode `me()` works for known users; in
          // real-API mode a 401 will land here and we sign the user out.
          set({ token: null, user: null, status: "unauthenticated" });
        }
      },
    }),
    {
      name: "todoist_auth",
      partialize: (s) => ({ token: s.token, user: s.user }),
    },
  ),
);