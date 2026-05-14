import { Task, Project, Label } from "@/types";

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const offset = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };

export const seedProjects: Project[] = [
  { id: "inbox", name: "Inbox", color: "#246fe0", favorite: false },
  { id: "p_work", name: "Work", color: "#db4035", favorite: true },
  { id: "p_personal", name: "Personal", color: "#14aaf5", favorite: true },
  { id: "p_health", name: "Health & Fitness", color: "#7ecc49", favorite: false },
  { id: "p_learn", name: "Learning", color: "#af38eb", favorite: false },
];

export const seedLabels: Label[] = [
  { id: "l_urgent", name: "urgent", color: "#db4035" },
  { id: "l_home", name: "home", color: "#7ecc49" },
  { id: "l_quick", name: "quick", color: "#14aaf5" },
  { id: "l_focus", name: "focus", color: "#af38eb" },
];

export const seedTasks: Task[] = [
  { id: "t1", title: "Review pull requests from team", completed: false, priority: 1, dueDate: offset(0), projectId: "p_work", labels: ["l_urgent"], order: 0, createdAt: new Date().toISOString() },
  { id: "t2", title: "Write project specs for Q3 launch", description: "Cover architecture, milestones, and risks.", completed: false, priority: 2, dueDate: offset(0), projectId: "p_work", labels: ["l_focus"], order: 1, createdAt: new Date().toISOString() },
  { id: "t3", title: "Reply to design feedback", completed: true, priority: 3, dueDate: offset(0), projectId: "p_work", labels: [], order: 2, createdAt: new Date().toISOString() },
  { id: "t4", title: "Morning run – 5km", completed: false, priority: 3, dueDate: offset(1), projectId: "p_health", labels: [], order: 3, createdAt: new Date().toISOString() },
  { id: "t5", title: "Read 30 pages of Atomic Habits", completed: false, priority: 4, dueDate: offset(1), projectId: "p_learn", labels: ["l_focus"], order: 4, createdAt: new Date().toISOString() },
  { id: "t6", title: "Buy groceries", completed: false, priority: 3, dueDate: offset(2), projectId: "p_personal", labels: ["l_home", "l_quick"], order: 5, createdAt: new Date().toISOString() },
  { id: "t7", title: "Plan weekend trip", completed: false, priority: 4, dueDate: offset(3), projectId: "p_personal", labels: [], order: 6, createdAt: new Date().toISOString() },
  { id: "t8", title: "Prepare slides for Monday review", completed: false, priority: 1, dueDate: offset(4), projectId: "p_work", labels: ["l_urgent"], order: 7, createdAt: new Date().toISOString() },
  { id: "t9", title: "Stretching routine", completed: true, priority: 4, dueDate: offset(-1), projectId: "p_health", labels: [], order: 8, createdAt: new Date().toISOString() },
  { id: "t10", title: "Inbox zero", completed: false, priority: 3, projectId: "inbox", labels: [], order: 9, createdAt: new Date().toISOString() },
  { id: "t11", title: "Call mom", completed: false, priority: 2, dueDate: offset(0), projectId: "p_personal", labels: [], order: 10, createdAt: new Date().toISOString() },
  { id: "t12", title: "Finish onboarding course", completed: false, priority: 3, dueDate: offset(5), projectId: "p_learn", labels: [], order: 11, createdAt: new Date().toISOString() },
];

// Generate completed history for heatmap & weekly chart
const historyTitles = [
  "Standup notes", "Code review", "Update docs", "Refactor module", "Sync with PM", "Pair programming",
  "Workout", "Meditation", "Journal entry", "Read article", "Fix bug", "Email triage", "Plan day",
  "Deploy release", "QA pass", "1:1 with manager", "Team retro", "Write tests",
];
const historyProjects = ["p_work", "p_personal", "p_health", "p_learn"];
let hid = 100;
for (let day = 1; day <= 60; day++) {
  // skip a few random days for realistic streak gaps
  if (day % 11 === 0 || day % 17 === 0) continue;
  const count = 1 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    seedTasks.push({
      id: `h${hid++}`,
      title: historyTitles[(day + i) % historyTitles.length],
      completed: true,
      priority: ((i % 4) + 1) as any,
      dueDate: offset(-day),
      projectId: historyProjects[(day + i) % historyProjects.length],
      labels: [],
      order: 1000 + hid,
      createdAt: new Date(Date.now() - day * 86400000).toISOString(),
    });
  }
}