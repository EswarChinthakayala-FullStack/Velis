import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { uploadTaskAttachmentFile } from '../lib/storage/task-attachments';
import { createTaskAttachmentRecord } from '../../../lib/supabase/queries/tasks';
import type { TaskAttachmentItem } from '../lib/types/task';

export interface TaskUploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  attachment?: TaskAttachmentItem;
}

export function useUploadTaskAttachment(taskId?: string | null) {
  const [queue, setQueue] = useState<TaskUploadItem[]>([]);
  const queryClient = useQueryClient();

  const uploadFiles = async (files: File[]): Promise<TaskAttachmentItem[]> => {
    if (!taskId) return [];

    const newItems: TaskUploadItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: 'uploading',
    }));

    setQueue((prev) => [...prev, ...newItems]);

    const createdAttachments: TaskAttachmentItem[] = [];

    for (const item of newItems) {
      try {
        const { fileName, fileUrl } = await uploadTaskAttachmentFile(taskId, item.file, (progress) => {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress } : q))
          );
        });

        const record = await createTaskAttachmentRecord(taskId, fileName, fileUrl);

        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'completed', progress: 100, attachment: record } : q))
        );

        createdAttachments.push(record);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed.';
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: msg } : q))
        );
      }
    }

    queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
    queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });

    return createdAttachments;
  };

  const removeQueueItem = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  return {
    queue,
    uploadFiles,
    removeQueueItem,
    isUploading: queue.some((q) => q.status === 'uploading'),
  };
}

export default useUploadTaskAttachment;
