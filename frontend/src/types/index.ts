export type Priority = 1 | 2 | 3 | 4;

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // ISO date
  projectId: string;
  labels: string[];
  parentId?: string | null;
  order: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  parentId?: string | null;
  favorite?: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}