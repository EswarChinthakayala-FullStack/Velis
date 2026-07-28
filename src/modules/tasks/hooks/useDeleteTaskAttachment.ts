import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTaskAttachmentRecord } from '../../../lib/supabase/queries/tasks';
import { deleteTaskAttachmentFile } from '../lib/storage/task-attachments';
import type { TaskAttachmentItem } from '../lib/types/task';

export function useDeleteTaskAttachment(taskId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, TaskAttachmentItem>({
    mutationFn: async (attachment) => {
      await deleteTaskAttachmentFile(attachment.fileUrl);
      return await deleteTaskAttachmentRecord(attachment.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export default useDeleteTaskAttachment;
