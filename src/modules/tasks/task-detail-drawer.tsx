import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTask } from './hooks/useTask';
import { useUpdateTask } from './hooks/useUpdateTask';
import { useDeleteTask } from './hooks/useDeleteTask';
import { useTaskAttachments } from './hooks/useTaskAttachments';
import { useUploadTaskAttachment } from './hooks/useUploadTaskAttachment';
import { useDeleteTaskAttachment } from './hooks/useDeleteTaskAttachment';

import type { TaskPriority, TaskStatus, TaskAttachmentItem, TaskItem, UpdateTaskPayload } from './lib/types/task';
import { TaskDrawerHeader } from './components/TaskDrawerHeader';
import { TaskDrawerMetadata } from './components/TaskDrawerMetadata';
import { TaskDrawerDescription } from './components/TaskDrawerDescription';
import { TaskDrawerAttachments } from './components/TaskDrawerAttachments';
import { RadialSpinner } from '../projects/components/RadialSpinner';

import { ConfirmDeleteDialog } from '../../components/ui/confirm-delete-dialog';

interface TaskDetailDrawerProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  taskId,
  isOpen,
  onClose,
  projectId,
}) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Queries & Mutations
  const { data: task, isLoading } = useTask(taskId);
  const { data: attachments = [] } = useTaskAttachments(taskId);

  const updateMutation = useUpdateTask(projectId);
  const deleteMutation = useDeleteTask(projectId);
  const { queue, uploadFiles, removeQueueItem } = useUploadTaskAttachment(taskId);
  const deleteAttachmentMutation = useDeleteTaskAttachment(taskId);

  // Local Form State for Auto-Save
  const [localTask, setLocalTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    if (task) {
      setLocalTask(task);
    }
  }, [task]);

  // Debounced Auto-Save Dispatcher
  const handleDebouncedUpdate = useCallback(
    (updates: UpdateTaskPayload) => {
      if (!taskId) return;
      setAutoSaveStatus('saving');
      updateMutation.mutate(
        { id: taskId, payload: updates },
        {
          onSuccess: () => {
            setAutoSaveStatus('saved');
          },
          onError: () => {
            setAutoSaveStatus('unsaved');
          },
        }
      );
    },
    [taskId, updateMutation]
  );

  // Inline Cell Edits
  const handleStatusChange = (status: TaskStatus) => {
    if (!localTask) return;
    setLocalTask((prev) => (prev ? { ...prev, status } : null));
    handleDebouncedUpdate({ status, progress: status === 'completed' ? 100 : localTask.progress });
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    if (!localTask) return;
    setLocalTask((prev) => (prev ? { ...prev, priority } : null));
    handleDebouncedUpdate({ priority });
  };

  const handleModuleChange = (module: string) => {
    if (!localTask) return;
    setLocalTask((prev) => (prev ? { ...prev, module } : null));
    handleDebouncedUpdate({ module });
  };

  const handleDueDateChange = (dueDate: string) => {
    if (!localTask) return;
    setLocalTask((prev) => (prev ? { ...prev, dueDate } : null));
    handleDebouncedUpdate({ dueDate });
  };

  const handleProgressChange = (progress: number) => {
    if (!localTask) return;
    const status: TaskStatus = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'todo';
    setLocalTask((prev) => (prev ? { ...prev, progress, status } : null));
    handleDebouncedUpdate({ progress, status });
  };

  const handleLabelsChange = (labels: string[]) => {
    if (!localTask) return;
    setLocalTask((prev) => (prev ? { ...prev, labels } : null));
    handleDebouncedUpdate({ labels });
  };

  const handleDescriptionChange = (description: string) => {
    if (!localTask) return;
    setLocalTask((prev) => (prev ? { ...prev, description } : null));
    setAutoSaveStatus('unsaved');
    const timer = setTimeout(() => {
      handleDebouncedUpdate({ description });
    }, 1000);
    return () => clearTimeout(timer);
  };

  // Keyboard & Backdrop Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-sm select-none font-mono text-zinc-100">
        {/* Backdrop Click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Slide-over Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="absolute inset-y-0 right-0 w-full max-w-2xl bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
        >
          {isLoading || !localTask ? (
            <div className="p-8 flex items-center justify-center h-full">
              <RadialSpinner size={24} className="text-white" />
            </div>
          ) : (
            <>
              {/* Header */}
              <TaskDrawerHeader
                task={localTask}
                autoSaveStatus={autoSaveStatus}
                onClose={onClose}
                onDeleteTask={() => setIsConfirmDeleteOpen(true)}
              />

              {/* Scrollable Content Body */}
              <div className="flex-1 p-5 space-y-6 overflow-y-auto custom-scrollbar">
                {/* 1. Metadata Panel */}
                <TaskDrawerMetadata
                  task={localTask}
                  onChangeStatus={handleStatusChange}
                  onChangePriority={handlePriorityChange}
                  onChangeModule={handleModuleChange}
                  onChangeDueDate={handleDueDateChange}
                  onChangeProgress={handleProgressChange}
                  onChangeLabels={handleLabelsChange}
                />

                {/* 2. Description Editor Workspace */}
                <TaskDrawerDescription
                  description={localTask.description || ''}
                  onChangeDescription={handleDescriptionChange}
                />

                {/* 3. Attachments & Documents */}
                <TaskDrawerAttachments
                  attachments={attachments}
                  uploadQueue={queue}
                  onUploadFiles={uploadFiles}
                  onDeleteAttachment={(att: TaskAttachmentItem) => deleteAttachmentMutation.mutate(att)}
                  onRemoveQueueItem={removeQueueItem}
                />
              </div>
            </>
          )}
        </motion.div>

        {/* Confirm Delete Task Dialog */}
        <ConfirmDeleteDialog
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={async () => {
            if (localTask) {
              await deleteMutation.mutateAsync(localTask.id);
              onClose();
            }
          }}
          title="Delete Task"
          description={`Are you sure you want to delete task "${localTask?.title || ''}"? This action cannot be undone.`}
          confirmText="Delete Task"
          isLoading={deleteMutation.isPending}
        />
      </div>
    </AnimatePresence>
  );
};

export default TaskDetailDrawer;
