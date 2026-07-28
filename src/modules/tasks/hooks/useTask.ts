import { useQuery } from '@tanstack/react-query';
import { fetchTaskById } from '../../../lib/supabase/queries/tasks';
import type { TaskItem } from '../lib/types/task';

export function useTask(taskId?: string | null) {
  return useQuery<TaskItem | null>({
    queryKey: ['task', taskId],
    queryFn: async (): Promise<TaskItem | null> => {
      if (!taskId) return null;
      return await fetchTaskById(taskId);
    },
    enabled: Boolean(taskId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export default useTask;
