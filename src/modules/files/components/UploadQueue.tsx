import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UploadTask } from '../lib/types/file';
import { UploadProgress } from './UploadProgress';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Cancel01Icon, Upload01Icon } from '@hugeicons/core-free-icons';

interface UploadQueueProps {
  tasks: UploadTask[];
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onClear: () => void;
}

export const UploadQueue: React.FC<UploadQueueProps> = ({
  tasks,
  onCancel,
  onRetry,
  onClear,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (tasks.length === 0) return null;

  const activeCount = tasks.filter((t) => t.status === 'uploading').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-40 w-80 sm:w-96 rounded-lg bg-[#0c0c0e]/95 border border-zinc-800 shadow-2xl backdrop-blur-xl font-mono text-xs overflow-hidden select-none"
      >
        {/* Header */}
        <div className="p-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Upload01Icon} size={15} className="text-zinc-400" />
            <span className="font-bold text-white tracking-tight">
              {activeCount > 0
                ? `Uploading (${activeCount}/${tasks.length})...`
                : `Uploads Completed (${completedCount}/${tasks.length})`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
            >
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={14}
                className={isMinimized ? 'rotate-180 transition-transform' : ''}
              />
            </button>
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
              title="Close panel"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
          </div>
        </div>

        {/* Task List */}
        {!isMinimized && (
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {tasks.map((task) => (
              <UploadProgress
                key={task.id}
                task={task}
                onCancel={onCancel}
                onRetry={onRetry}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadQueue;
