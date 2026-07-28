import { useQuery } from '@tanstack/react-query';
import { fetchTaskAttachments } from '../../../lib/supabase/queries/tasks';
import type { TaskAttachmentItem } from '../lib/types/task';

export function useTaskAttachments(taskId?: string | null) {
  return useQuery<TaskAttachmentItem[]>({
    queryKey: ['task-attachments', taskId],
    queryFn: async (): Promise<TaskAttachmentItem[]> => {
      if (!taskId) return [];
      return await fetchTaskAttachments(taskId);
    },
    enabled: Boolean(taskId),
  });
}

export default useTaskAttachments;
