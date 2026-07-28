import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../../../lib/supabase/queries/tasks';
import type { CreateTaskPayload, TaskItem } from '../lib/types/task';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<TaskItem, Error, CreateTaskPayload>({
    mutationFn: async (payload) => {
      return await createTask(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export default useCreateTask;
