import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask, bulkDeleteTasks } from '../../../lib/supabase/queries/tasks';

export function useDeleteTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      return await deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useBulkDeleteTasks(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string[]>({
    mutationFn: async (ids: string[]) => {
      return await bulkDeleteTasks(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export default useDeleteTask;
