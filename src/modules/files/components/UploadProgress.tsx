import React from 'react';
import type { UploadTask } from '../lib/types/file';
import { formatBytes, formatSpeed } from '../lib/utils/mime-utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, Cancel01Icon, RefreshIcon } from '@hugeicons/core-free-icons';

interface UploadProgressProps {
  task: UploadTask;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  task,
  onCancel,
  onRetry,
}) => {
  return (
    <div className="p-2.5 rounded-md bg-zinc-900/90 border border-zinc-800 font-mono text-xs space-y-1.5 shadow-sm select-none">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-white truncate max-w-[180px]" title={task.name}>
          {task.name}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {task.status === 'completed' && (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-400" />
          )}
          {task.status === 'error' && (
            <button
              type="button"
              onClick={() => onRetry(task.id)}
              className="p-1 rounded hover:bg-zinc-800 text-amber-400 cursor-pointer"
              title="Retry upload"
            >
              <HugeiconsIcon icon={RefreshIcon} size={13} />
            </button>
          )}
          {task.status === 'uploading' && (
            <button
              type="button"
              onClick={() => onCancel(task.id)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              title="Cancel upload"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            task.status === 'completed'
              ? 'bg-emerald-500'
              : task.status === 'error'
                ? 'bg-rose-500'
                : 'bg-white'
          }`}
          style={{ width: `${task.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-500">
        <span>{formatBytes(task.size)}</span>
        <span>
          {task.status === 'uploading' && task.speedBps ? formatSpeed(task.speedBps) : task.status}
        </span>
      </div>

      {task.error && (
        <span className="block text-[10px] text-rose-400 truncate">{task.error}</span>
      )}
    </div>
  );
};

export default UploadProgress;
