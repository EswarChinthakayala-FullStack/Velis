import { useState, useCallback } from 'react';
import type { BatchUploadTask } from '../lib/utils/upload-manager';
import { createBatchUploadTask } from '../lib/utils/upload-manager';
import { compressScreenshotImage } from '../lib/utils/image-compression';
import { uploadScreenshotFile } from '../../../lib/supabase/queries/screenshots';
import { useQueryClient } from '@tanstack/react-query';

export function useUploadQueue(projectId?: string | null) {
  const [tasks, setTasks] = useState<BatchUploadTask[]>([]);
  const queryClient = useQueryClient();

  const addFilesToQueue = useCallback((files: File[]) => {
    const newTasks = files.map((f) => createBatchUploadTask(f));
    setTasks((prev) => [...prev, ...newTasks]);
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.controller) target.controller.abort();
      return prev.filter((t) => t.id !== taskId);
    });
  }, []);

  const cancelTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          if (t.controller) t.controller.abort();
          return { ...t, status: 'cancelled', error: 'Upload cancelled by user' };
        }
        return t;
      })
    );
  }, []);

  const startTaskUpload = useCallback(async (task: BatchUploadTask) => {
    const controller = new AbortController();

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: 'compressing', controller } : t
      )
    );

    try {
      // 1. Compress image if oversized
      const compressedFile = await compressScreenshotImage(task.file);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: 'uploading', progress: 30 } : t
        )
      );

      // 2. Upload to Supabase Storage + Database record
      const result = await uploadScreenshotFile(compressedFile, {
        title: task.title,
        description: task.description,
        moduleName: task.moduleName,
        milestoneId: task.milestoneId,
        projectId,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: 'success',
                progress: 100,
                storagePath: result.storagePath,
              }
            : t
        )
      );

      queryClient.invalidateQueries({
        queryKey: ['screenshots'],
      });
    } catch (err: any) {
      if (controller.signal.aborted) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? { ...t, status: 'cancelled', error: 'Upload cancelled' }
              : t
          )
        );
      } else {
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
  }, [projectId, queryClient]);

  const updateTaskMetadata = useCallback(
    (taskId: string, updates: Partial<Pick<BatchUploadTask, 'title' | 'description' | 'moduleName' | 'milestoneId'>>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => t.status !== 'success'));
  }, []);

  return {
    tasks,
    addFilesToQueue,
    removeTask,
    cancelTask,
    startTaskUpload,
    updateTaskMetadata,
    clearCompleted,
  };
}
