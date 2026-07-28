import React from 'react';
import type { BatchUploadTask } from '../lib/utils/upload-manager';
import { formatBytes } from '../lib/utils/mime-utils';
import { UploadProgress } from './UploadProgress';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  RefreshIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Edit01Icon,
} from '@hugeicons/core-free-icons';

interface UploadCardProps {
  task: BatchUploadTask;
  onCancel: (id: string) => void;
  onRetry: (task: BatchUploadTask) => void;
  onEditMetadata: (task: BatchUploadTask) => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  task,
  onCancel,
  onRetry,
  onEditMetadata,
}) => {
  return (
    <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-3 font-mono text-xs select-none">
      {/* Image Thumbnail */}
      <div className="w-12 h-12 rounded bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
        <img
          src={task.previewUrl}
          alt={task.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* File Info & Progress Bar */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-white font-sans truncate">{task.title}</span>
          <span className="text-[10px] text-zinc-500 shrink-0">{formatBytes(task.totalBytes)}</span>
        </div>

        <UploadProgress progress={task.progress} status={task.status} />

        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span className="capitalize">
            {task.status === 'compressing'
              ? 'Optimizing image...'
              : task.status === 'uploading'
              ? `Uploading... ${task.progress}%`
              : task.status === 'success'
              ? 'Uploaded to Supabase'
              : task.status}
          </span>
          {task.error && <span className="text-rose-400 truncate max-w-[160px]">{task.error}</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {task.status === 'success' && (
          <>
            <button
              type="button"
              onClick={() => onEditMetadata(task)}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              title="Edit Metadata"
            >
              <HugeiconsIcon icon={Edit01Icon} size={14} />
            </button>
            <div className="p-1.5 text-emerald-400" title="Upload Complete">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
            </div>
          </>
        )}

        {(task.status === 'error' || task.status === 'cancelled') && (
          <button
            type="button"
            onClick={() => onRetry(task)}
            className="p-1.5 rounded text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 cursor-pointer"
            title="Retry Upload"
          >
            <HugeiconsIcon icon={RefreshIcon} size={14} />
          </button>
        )}

        {(task.status === 'uploading' || task.status === 'idle') && (
          <button
            type="button"
            onClick={() => onCancel(task.id)}
            className="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
            title="Cancel Task"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadCard;
