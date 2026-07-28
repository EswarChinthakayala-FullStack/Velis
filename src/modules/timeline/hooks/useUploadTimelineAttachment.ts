import { useState } from 'react';
import { uploadTimelineAttachment } from '../lib/storage/timeline-attachments';
import type { TimelineAttachment } from '../lib/types/timeline';

export interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  attachment?: TimelineAttachment;
}

export function useUploadTimelineAttachment(projectId: string) {
  const [queue, setQueue] = useState<UploadItem[]>([]);

  const uploadFiles = async (files: File[]): Promise<TimelineAttachment[]> => {
    const newItems: UploadItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: 'uploading',
    }));

    setQueue((prev) => [...prev, ...newItems]);

    const uploadedAttachments: TimelineAttachment[] = [];

    for (const item of newItems) {
      try {
        const attachment = await uploadTimelineAttachment(projectId, item.file, (progress) => {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress } : q))
          );
        });

        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'completed', progress: 100, attachment } : q))
        );

        uploadedAttachments.push(attachment);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to upload attachment.';
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: msg } : q))
        );
      }
    }

    return uploadedAttachments;
  };

  const removeUploadItem = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return {
    queue,
    uploadFiles,
    removeUploadItem,
    clearQueue,
    isUploading: queue.some((q) => q.status === 'uploading'),
  };
}

export default useUploadTimelineAttachment;
