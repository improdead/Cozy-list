
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';
export type TaskTag = 'work' | 'personal' | 'urgent' | string;
export type TaskViewMode = 'list' | 'grid';
export type TaskSortOption = 'date' | 'priority' | 'alphabetical';
export type TaskFilterOption = 'all' | 'completed' | 'pending' | 'overdue';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date | null;
  priority: TaskPriority;
  tags: TaskTag[];
  createdAt: Date;
  updatedAt: Date;
}
