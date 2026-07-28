export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'testing' | 'completed';

export interface TaskAttachmentItem {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  projectId: string;
  projectName?: string;
  projectColor?: string;
  title: string;
  description?: string;
  module?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // YYYY-MM-DD
  progress: number; // 0-100
  labels: string[];
  attachments?: TaskAttachmentItem[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  projectId: string;
  title: string;
  description?: string;
  module?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  progress?: number;
  labels?: string[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  module?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
  progress?: number;
  labels?: string[];
  projectId?: string;
}

export interface TaskFilterState {
  search: string;
  projectId: string;
  module: string;
  priority: 'all' | TaskPriority;
  status: 'all' | TaskStatus;
  dueDate: 'all' | 'today' | 'tomorrow' | 'this_week' | 'overdue';
}

export interface TaskKpis {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  completed: number;
  overdue: number;
}
