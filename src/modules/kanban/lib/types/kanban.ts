import type { TaskItem, TaskStatus } from '../../../tasks/lib/types/task';

export interface KanbanColumnConfig {
  id: TaskStatus;
  title: string;
  badgeClass: string;
  headerColor: string;
}

export type KanbanGroupedTasks = Record<TaskStatus, TaskItem[]>;

export interface MoveTaskPayload {
  taskId: string;
  targetStatus: TaskStatus;
  targetSortOrder: number;
}
