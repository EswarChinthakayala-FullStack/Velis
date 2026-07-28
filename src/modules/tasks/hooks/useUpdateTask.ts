import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, bulkUpdateTasks } from '../../../lib/supabase/queries/tasks';
import type { UpdateTaskPayload, TaskItem } from '../lib/types/task';

export function useUpdateTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<
    TaskItem,
    Error,
    { id: string; payload: UpdateTaskPayload },
    { previousTasks?: TaskItem[] }
  >({
    mutationFn: async ({ id, payload }) => {
      return await updateTask(id, payload);
    },
    onMutate: async ({ id, payload }) => {
      const queryKey = ['tasks', projectId];

      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<TaskItem[]>(queryKey) || [];

      // Optimistically update item in cache
      queryClient.setQueryData<TaskItem[]>(queryKey, (old = []) =>
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
        queryClient.setQueryData(['tasks', projectId], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useBulkUpdateTasks(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { ids: string[]; payload: UpdateTaskPayload }>({
    mutationFn: async ({ ids, payload }) => {
      return await bulkUpdateTasks(ids, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export default useUpdateTask;
