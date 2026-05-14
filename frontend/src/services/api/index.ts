/**
 * Unified API facade.
 *
 * Every feature imports `api` from here. Each method tries the real Spring
 * Boot endpoint first and falls back to the local mock if the backend is
 * unreachable / not configured. This means the app is always functional in
 * development and gracefully upgrades the moment a backend is wired up.
 *
 * Endpoint contract (Spring Boot side, suggested):
 *   GET    /tasks
 *   POST   /tasks
 *   PATCH  /tasks/:id
 *   DELETE /tasks/:id
 *   POST   /tasks/reorder           { ids: string[] }
 *   GET    /projects
 *   POST   /projects
 *   GET    /labels
 *   POST   /auth/login              { email, password } -> { token, user }
 *   POST   /auth/register           { name, email, password } -> { token, user }
 *   GET    /auth/me                 -> { user }
 */
import { Task, Project, Label } from "@/types";
import { mockApi } from "../mock-api/db";
import { request, withFallback } from "./client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
export interface AuthResponse { token: string; user: AuthUser; }

export const api = {
  // ----- tasks -----
  getTasks: () => withFallback(() => request<Task[]>("/tasks"), () => mockApi.getTasks()),
  createTask: (input: Partial<Task>) =>
    withFallback(() => request<Task>("/tasks", { method: "POST", body: input }), () => mockApi.createTask(input)),
  updateTask: (id: string, patch: Partial<Task>) =>
    withFallback(() => request<Task>(`/tasks/${id}`, { method: "PATCH", body: patch }), () => mockApi.updateTask(id, patch)),
  deleteTask: (id: string) =>
    withFallback(() => request<void>(`/tasks/${id}`, { method: "DELETE" }), () => mockApi.deleteTask(id)),
  reorderTasks: (ids: string[]) =>
    withFallback(() => request<void>("/tasks/reorder", { method: "POST", body: { ids } }), () => mockApi.reorderTasks(ids)),

  // ----- projects / labels -----
  getProjects: () => withFallback(() => request<Project[]>("/projects"), () => mockApi.getProjects()),
  createProject: (input: Partial<Project>) =>
    withFallback(() => request<Project>("/projects", { method: "POST", body: input }), () => mockApi.createProject(input)),
  getLabels: () => withFallback(() => request<Label[]>("/labels"), () => mockApi.getLabels()),

  // ----- auth -----
  login: (email: string, password: string) =>
    withFallback(
      () => request<AuthResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false }),
      () => mockApi.login(email, password),
    ),
  register: (name: string, email: string, password: string) =>
    withFallback(
      () => request<AuthResponse>("/auth/register", { method: "POST", body: { name, email, password }, auth: false }),
      () => mockApi.register(name, email, password),
    ),
  me: () => withFallback(() => request<AuthUser>("/auth/me"), () => mockApi.me()),
};

export type Api = typeof api;