import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { normalizeClientError } from '../../utils/client-errors';
import type {
  TaskItem,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskStatus,
  TaskPriority,
  TaskAttachmentItem,
} from '../../../modules/tasks/lib/types/task';

/**
 * Enterprise Tasks Data Access Layer (PHASE 10)
 * Single source of truth for all task queries, attachments, and CRUD mutations.
 * Pure data layer: ZERO mock data, ZERO SELECT * queries.
 */

export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  list: (projectId?: string) => ['tasks', projectId || 'all'] as const,
  detail: (id?: string | null) => ['task', id || ''] as const,
  attachments: (id?: string | null) => ['task-attachments', id || ''] as const,
};

const TASKS_SELECT_COLUMNS =
  'id, project_id, title, description, module, priority, status, due_date, progress, labels, sort_order, created_at, updated_at, projects(id, name, color), task_attachments(id, task_id, file_name, file_url, created_at)';

export function mapRowToTaskItem(row: any): TaskItem {
  const projectData = row.projects;
  const attachmentsData = Array.isArray(row.task_attachments) ? row.task_attachments : [];

  return {
    id: String(row.id),
    projectId: String(row.project_id),
    projectName: projectData?.name ? String(projectData.name) : undefined,
    projectColor: projectData?.color ? String(projectData.color) : undefined,
    title: String(row.title),
    description: row.description ? String(row.description) : undefined,
    module: row.module ? String(row.module) : undefined,
    priority: (row.priority || 'medium') as TaskPriority,
    status: (row.status || 'todo') as TaskStatus,
    dueDate: row.due_date ? String(row.due_date) : undefined,
    progress: Number(row.progress ?? 0),
    labels: Array.isArray(row.labels) ? row.labels.map(String) : [],
    attachments: attachmentsData.map((a: any) => ({
      id: String(a.id),
      taskId: String(a.task_id || row.id),
      fileName: String(a.file_name),
      fileUrl: String(a.file_url),
      createdAt: String(a.created_at),
    })),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

/**
 * Fetch all tasks from Supabase public.tasks table
 */
export async function fetchTasks(projectId?: string): Promise<TaskItem[]> {
  try {
    let query = (supabase as any)
      .from('tasks')
      .select(TASKS_SELECT_COLUMNS)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (projectId && projectId !== 'all') {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    const rawTasks = data || [];
    return rawTasks.map(mapRowToTaskItem);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

/**
 * Fetch single task by ID
 */
export async function fetchTaskById(id: string): Promise<TaskItem | null> {
  if (!id) return null;

  try {
    const { data, error } = await (supabase as any)
      .from('tasks')
      .select(TASKS_SELECT_COLUMNS)
      .eq('id', id)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    if (!data) return null;
    return mapRowToTaskItem(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch task details.';
    throw new Error(message);
  }
}

/**
 * Fetch attachments for a task
 */
export async function fetchTaskAttachments(taskId: string): Promise<TaskAttachmentItem[]> {
  if (!taskId) return [];

  try {
    const { data, error } = await (supabase as any)
      .from('task_attachments')
      .select('id, task_id, file_name, file_url, created_at')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    if (!Array.isArray(data)) return [];
    return data.map((a: any) => ({
      id: String(a.id),
      taskId: String(a.task_id),
      fileName: String(a.file_name),
      fileUrl: String(a.file_url),
      createdAt: String(a.created_at),
    }));
  } catch {
    return [];
  }
}

/**
 * Create task attachment record in database
 */
export async function createTaskAttachmentRecord(
  taskId: string,
  fileName: string,
  fileUrl: string
): Promise<TaskAttachmentItem> {
  try {
    const { data, error } = await (supabase as any)
      .from('task_attachments')
      .insert({
        task_id: taskId,
        file_name: fileName,
        file_url: fileUrl,
      })
      .select('id, task_id, file_name, file_url, created_at')
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return {
      id: String(data.id),
      taskId: String(data.task_id),
      fileName: String(data.file_name),
      fileUrl: String(data.file_url),
      createdAt: String(data.created_at),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save task attachment.';
    throw new Error(message);
  }
}

/**
 * Delete task attachment record
 */
export async function deleteTaskAttachmentRecord(attachmentId: string): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('task_attachments')
      .delete()
      .eq('id', attachmentId);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Insert a new task into public.tasks
 */
export async function createTask(payload: CreateTaskPayload): Promise<TaskItem> {
  if (!payload.projectId) throw new Error('Project selection is required.');
  if (!payload.title.trim()) throw new Error('Task title is required.');

  try {
    const record = {
      project_id: payload.projectId,
      title: payload.title.trim(),
      description: payload.description || null,
      module: payload.module || null,
      priority: payload.priority || 'medium',
      status: payload.status || 'todo',
      due_date: payload.dueDate || null,
      progress: payload.progress ?? 0,
      labels: payload.labels || [],
    };

    const { data, error } = await (supabase as any)
      .from('tasks')
      .insert(record)
      .select(TASKS_SELECT_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToTaskItem(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create task.';
    throw new Error(message);
  }
}

/**
 * Update an existing task in public.tasks
 */
export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<TaskItem> {
  if (!id) throw new Error('Task ID is required.');

  try {
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.projectId !== undefined) updates.project_id = payload.projectId;
    if (payload.title !== undefined) updates.title = payload.title.trim();
    if (payload.description !== undefined) updates.description = payload.description || null;
    if (payload.module !== undefined) updates.module = payload.module || null;
    if (payload.priority !== undefined) updates.priority = payload.priority;
    if (payload.status !== undefined) updates.status = payload.status;
    if (payload.dueDate !== undefined) updates.due_date = payload.dueDate || null;
    if (payload.progress !== undefined) updates.progress = payload.progress;
    if (payload.labels !== undefined) updates.labels = payload.labels;

    const { data, error } = await (supabase as any)
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select(TASKS_SELECT_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToTaskItem(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update task.';
    throw new Error(message);
  }
}

/**
 * Atomic status + sort_order update for Kanban Drag-and-Drop moves
 * Single backend update operation mutating status, sort_order, and progress
 */
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  sortOrder?: number
): Promise<TaskItem> {
  if (!taskId) throw new Error('Task ID is required.');

  try {
    const updates: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (typeof sortOrder === 'number') {
      updates.sort_order = sortOrder;
    }

    if (status === 'completed') {
      updates.progress = 100;
    }

    const { data, error } = await (supabase as any)
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select(TASKS_SELECT_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToTaskItem(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update task status.';
    throw new Error(message);
  }
}

/**
 * Delete a single task from public.tasks
 */
export async function deleteTask(id: string): Promise<boolean> {
  if (!id) throw new Error('Task ID is required.');

  try {
    const { error } = await (supabase as any)
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete task.';
    throw new Error(message);
  }
}

/**
 * Bulk update tasks in public.tasks
 */
export async function bulkUpdateTasks(ids: string[], payload: UpdateTaskPayload): Promise<boolean> {
  if (!ids || ids.length === 0) return true;

  try {
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.status !== undefined) updates.status = payload.status;
    if (payload.priority !== undefined) updates.priority = payload.priority;
    if (payload.projectId !== undefined) updates.project_id = payload.projectId;

    const { error } = await (supabase as any)
      .from('tasks')
      .update(updates)
      .in('id', ids);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed bulk task update.';
    throw new Error(message);
  }
}

/**
 * Bulk delete tasks from public.tasks
 */
export async function bulkDeleteTasks(ids: string[]): Promise<boolean> {
  if (!ids || ids.length === 0) return true;

  try {
    const { error } = await (supabase as any)
      .from('tasks')
      .delete()
      .in('id', ids);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed bulk task deletion.';
    throw new Error(message);
  }
}

/* ============================================================================
 * Centralized React Query Hooks
 * ============================================================================ */

export function useTasks(projectId?: string) {
  return useQuery<TaskItem[]>({
    queryKey: TASK_QUERY_KEYS.list(projectId),
    queryFn: async () => fetchTasks(projectId),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useTask(id?: string | null) {
  return useQuery<TaskItem | null>({
    queryKey: TASK_QUERY_KEYS.detail(id),
    queryFn: async () => (id ? fetchTaskById(id) : null),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<TaskItem, Error, CreateTaskPayload>({
    mutationFn: async (payload) => createTask(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<
    TaskItem,
    Error,
    { id: string; payload: UpdateTaskPayload },
    { previousTasks?: TaskItem[] }
  >({
    mutationFn: async ({ id, payload }) => updateTask(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.all });

      const previousTasks = queryClient.getQueryData<TaskItem[]>(TASK_QUERY_KEYS.list(projectId));

      queryClient.setQueriesData<TaskItem[]>({ queryKey: TASK_QUERY_KEYS.all }, (old = []) =>
        old.map((t) => {
          if (t.id !== id) return t;
          return {
            ...t,
            ...payload,
            dueDate: payload.dueDate === null ? undefined : (payload.dueDate ?? t.dueDate),
            updatedAt: new Date().toISOString(),
          };
        })
      );

      return { previousTasks };
    },
    onError: (_, __, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASK_QUERY_KEYS.list(projectId), context.previousTasks);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
}

export function useUpdateTaskStatus(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<
    TaskItem,
    Error,
    { taskId: string; status: TaskStatus; sortOrder?: number },
    { previousTasks?: TaskItem[] }
  >({
    mutationFn: async ({ taskId, status, sortOrder }) => updateTaskStatus(taskId, status, sortOrder),
    onMutate: async ({ taskId, status, sortOrder }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.all });

      const previousTasks = queryClient.getQueryData<TaskItem[]>(TASK_QUERY_KEYS.list(projectId));

      queryClient.setQueriesData<TaskItem[]>({ queryKey: TASK_QUERY_KEYS.all }, (old = []) =>
        old.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            status,
            sortOrder: typeof sortOrder === 'number' ? sortOrder : t.sortOrder,
            progress: status === 'completed' ? 100 : t.progress,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      return { previousTasks };
    },
    onError: (_, __, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASK_QUERY_KEYS.list(projectId), context.previousTasks);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
}

export function useDeleteTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => deleteTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
}

export function useBulkUpdateTasks(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { ids: string[]; payload: UpdateTaskPayload }>({
    mutationFn: async ({ ids, payload }) => bulkUpdateTasks(ids, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
}

export function useBulkDeleteTasks(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string[]>({
    mutationFn: async (ids) => bulkDeleteTasks(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
}
