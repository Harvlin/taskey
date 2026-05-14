import { Task, Project, Label } from "@/types";
import { seedProjects, seedLabels, seedTasks } from "./seed";

const KEY = "todoist_clone_db_v2";
const USERS_KEY = "todoist_clone_users_v1";

interface DB { tasks: Task[]; projects: Project[]; labels: Label[]; }
interface MockUser { id: string; name: string; email: string; password: string; avatarUrl?: string; }

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial: DB = { tasks: seedTasks, projects: seedProjects, labels: seedLabels };
  localStorage.setItem(KEY, JSON.stringify(initial));
  return initial;
}

function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

const delay = (min = 250, max = 600) =>
  new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));

const uid = () => Math.random().toString(36).slice(2, 10);

function loadUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seeded: MockUser[] = [
    { id: "u_demo", name: "Alex Morgan", email: "demo@todoist.local", password: "demo1234" },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}
function saveUsers(users: MockUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function publicUser(u: MockUser) {
  return { id: u.id, name: u.name, email: u.email, avatarUrl: u.avatarUrl };
}

function mockToken(userId: string) {
  return `mock.${btoa(userId)}.${Date.now().toString(36)}`;
}

function userIdFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts[0] !== "mock") return null;
    return atob(parts[1]);
  } catch { return null; }
}

export const mockApi = {
  async getTasks(): Promise<Task[]> { await delay(); return load().tasks; },
  async getProjects(): Promise<Project[]> { await delay(150, 300); return load().projects; },
  async getLabels(): Promise<Label[]> { await delay(150, 300); return load().labels; },
  async createTask(input: Partial<Task>): Promise<Task> {
    await delay();
    const db = load();
    const task: Task = {
      id: uid(),
      title: input.title || "Untitled",
      description: input.description,
      completed: false,
      priority: (input.priority as any) || 4,
      dueDate: input.dueDate,
      projectId: input.projectId || "inbox",
      labels: input.labels || [],
      parentId: input.parentId || null,
      order: db.tasks.length,
      createdAt: new Date().toISOString(),
    };
    db.tasks.push(task);
    save(db);
    return task;
  },
  async updateTask(id: string, patch: Partial<Task>): Promise<Task> {
    await delay(200, 400);
    const db = load();
    const idx = db.tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Not found");
    db.tasks[idx] = { ...db.tasks[idx], ...patch };
    save(db);
    return db.tasks[idx];
  },
  async deleteTask(id: string): Promise<void> {
    await delay(200, 400);
    const db = load();
    db.tasks = db.tasks.filter((t) => t.id !== id && t.parentId !== id);
    save(db);
  },
  async createProject(input: Partial<Project>): Promise<Project> {
    await delay();
    const db = load();
    const proj: Project = {
      id: uid(),
      name: input.name || "Project",
      color: input.color || "#246fe0",
      favorite: input.favorite || false,
    };
    db.projects.push(proj);
    save(db);
    return proj;
  },
  async reorderTasks(ids: string[]): Promise<void> {
    await delay(100, 200);
    const db = load();
    ids.forEach((id, i) => {
      const t = db.tasks.find((t) => t.id === id);
      if (t) t.order = i;
    });
    save(db);
  },

  // ----- auth -----
  async login(email: string, password: string) {
    await delay(400, 700);
    const users = loadUsers();
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || u.password !== password) {
      const err = new Error("Invalid email or password");
      (err as any).status = 401;
      throw err;
    }
    return { token: mockToken(u.id), user: publicUser(u) };
  },
  async register(name: string, email: string, password: string) {
    await delay(400, 700);
    const users = loadUsers();
    if (users.some((x) => x.email.toLowerCase() === email.toLowerCase())) {
      const err = new Error("An account with that email already exists");
      (err as any).status = 409;
      throw err;
    }
    const u: MockUser = { id: "u_" + uid(), name, email, password };
    users.push(u);
    saveUsers(users);
    return { token: mockToken(u.id), user: publicUser(u) };
  },
  async me() {
    await delay(100, 200);
    const raw = localStorage.getItem("todoist_auth");
    const token = raw ? JSON.parse(raw)?.state?.token : null;
    const id = token ? userIdFromToken(token) : null;
    const u = id ? loadUsers().find((x) => x.id === id) : null;
    if (!u) { const err = new Error("Not authenticated"); (err as any).status = 401; throw err; }
    return publicUser(u);
  },
};

// Backwards-compat alias for any leftover imports.
export const api = mockApi;