import React from 'react';
import type { BatchUploadTask } from '../lib/utils/upload-manager';
import { formatBytes } from '../lib/utils/mime-utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';

interface UploadSummaryProps {
  tasks: BatchUploadTask[];
  onClearCompleted: () => void;
}

export const UploadSummary: React.FC<UploadSummaryProps> = ({
  tasks,
  onClearCompleted,
}) => {
  const successCount = tasks.filter((t) => t.status === 'success').length;
  const totalBytes = tasks
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.totalBytes, 0);

  if (successCount === 0) return null;

  return (
    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/60 flex items-center justify-between font-mono text-xs text-emerald-300 select-none">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-emerald-400" />
        <span>
          Successfully uploaded {successCount} screenshot{successCount > 1 ? 's' : ''} ({formatBytes(totalBytes)})
        </span>
      </div>

      <button
        type="button"
        onClick={onClearCompleted}
        className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
      >
        Clear Completed
      </button>
    </div>
  );
};

export default UploadSummary;
