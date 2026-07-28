import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { UploadTask } from '../lib/types/file';
import { uploadFileToSupabase } from '../../../lib/supabase/queries/files';
import { fileKeys, folderKeys } from '../../../lib/supabase/queries/query-keys';

export function useUploadFiles(projectId?: string | null, currentFolderId?: string | null) {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const startUploads = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const newTasks: UploadTask[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
        uploadedBytes: 0,
      }));

      setTasks((prev) => [...newTasks, ...prev]);
      setIsUploading(true);

      for (const task of newTasks) {
        const startTime = Date.now();

        try {
          // Progressive upload steps for UI progress bar
          setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, progress: 30 } : t))
          );

          await uploadFileToSupabase(task.file, projectId, currentFolderId);

          const elapsedTimeSec = (Date.now() - startTime) / 1000 || 1;
          const speedBps = Math.round(task.size / elapsedTimeSec);

          setTasks((prev) =>
            prev.map((t) =>
              t.id === task.id
                ? {
                    ...t,
                    progress: 100,
                    status: 'completed',
                    speedBps,
                    uploadedBytes: task.size,
                  }
                : t
            )
          );

          // Invalidate immediately after each file succeeds so UI updates in real-time
          queryClient.invalidateQueries({ queryKey: fileKeys.all });
          queryClient.invalidateQueries({ queryKey: folderKeys.all });
        } catch (err: any) {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === task.id
                ? {
                    ...t,
                    status: 'error',
                    error: err.message || 'Upload failed',
                  }
                : t
            )
          );
        }
      }

      setIsUploading(false);

      // Final query invalidation to ensure UI is fresh
      queryClient.invalidateQueries({ queryKey: fileKeys.all });
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
    [projectId, currentFolderId, queryClient]
  );

  const cancelTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'canceled' } : t))
    );
  }, []);

  const retryTask = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: 'uploading', progress: 10, error: undefined } : t
        )
      );

      try {
        await uploadFileToSupabase(task.file, projectId, currentFolderId);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, progress: 100, status: 'completed' } : t
          )
        );

        queryClient.invalidateQueries({ queryKey: fileKeys.all });
        queryClient.invalidateQueries({ queryKey: folderKeys.all });
      } catch (err: any) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: 'error', error: err.message } : t
          )
        );
      }
    },
    [tasks, projectId, currentFolderId, queryClient]
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => t.status === 'uploading'));
  }, []);

  return {
    tasks,
    isUploading,
    startUploads,
    cancelTask,
    retryTask,
    clearCompleted,
  };
}
