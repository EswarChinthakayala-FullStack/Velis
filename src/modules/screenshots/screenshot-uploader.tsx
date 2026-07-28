import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUploadValidation } from './hooks/useUploadValidation';
import { useUploadQueue } from './hooks/useUploadQueue';
import type { BatchUploadTask } from './lib/utils/upload-manager';

import { UploadDropzone } from './components/UploadDropzone';
import { UploadQueue } from './components/UploadQueue';
import { UploadSummary } from './components/UploadSummary';
import { UploadErrorState } from './components/UploadErrorState';
import { UploadMetadataDialog } from './components/UploadMetadataDialog';

import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon, Cancel01Icon, Image01Icon } from '@hugeicons/core-free-icons';

interface ScreenshotUploaderProps {
  projectId?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

export const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({
  projectId,
  isOpen,
  onClose,
  onUploadComplete,
}) => {
  const { validationErrors, validateFiles, clearErrors } = useUploadValidation();
  const {
    tasks,
    addFilesToQueue,
    removeTask,
    cancelTask,
    startTaskUpload,
    updateTaskMetadata,
    clearCompleted,
  } = useUploadQueue(projectId);

  const [editingTask, setEditingTask] = useState<BatchUploadTask | null>(null);

  // Handle new dropped or pasted files
  const handleDropFiles = (droppedFiles: File[]) => {
    clearErrors();
    const { validFiles } = validateFiles(droppedFiles);
    if (validFiles.length > 0) {
      addFilesToQueue(validFiles);
    }
  };

  // Automatically start idle uploads (up to 3 concurrent tasks)
  useEffect(() => {
    const activeCount = tasks.filter(
      (t) => t.status === 'compressing' || t.status === 'uploading'
    ).length;

    if (activeCount < 3) {
      const nextTask = tasks.find((t) => t.status === 'idle');
      if (nextTask) {
        startTaskUpload(nextTask);
      }
    }
  }, [tasks, startTaskUpload]);

  // Trigger callback when all tasks finish
  useEffect(() => {
    if (tasks.length > 0 && tasks.every((t) => t.status === 'success' || t.status === 'error' || t.status === 'cancelled')) {
      if (onUploadComplete) onUploadComplete();
    }
  }, [tasks, onUploadComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-2xl bg-[#0c0c0e] border border-zinc-800 rounded-xl p-6 font-mono text-xs space-y-4 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                <HugeiconsIcon icon={Upload01Icon} size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-sans tracking-tight">
                  Bulk Screenshot Ingestion
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Upload project progress screenshots directly to Supabase Storage
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          </div>

          {/* Validation Warnings */}
          <UploadErrorState errors={validationErrors} onClear={clearErrors} />

          {/* Dropzone */}
          <UploadDropzone onDropFiles={handleDropFiles} />

          {/* Queue List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
            <UploadQueue
              tasks={tasks}
              onCancel={cancelTask}
              onRetry={startTaskUpload}
              onEditMetadata={setEditingTask}
            />

            <UploadSummary tasks={tasks} onClearCompleted={clearCompleted} />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-zinc-500 font-mono">
              {tasks.length} item{tasks.length === 1 ? '' : 's'} in queue
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs font-mono hover:bg-zinc-200 cursor-pointer shadow"
            >
              Done
            </button>
          </div>
        </motion.div>

        {/* Metadata Editor Modal */}
        <UploadMetadataDialog
          task={editingTask}
          onSave={(taskId, updates) => updateTaskMetadata(taskId, updates)}
          onClose={() => setEditingTask(null)}
        />
      </div>
    </AnimatePresence>
  );
};

export default ScreenshotUploader;
