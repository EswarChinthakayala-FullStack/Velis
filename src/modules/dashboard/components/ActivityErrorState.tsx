import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { RefreshIcon } from '@hugeicons/core-free-icons';

interface ActivityErrorStateProps {
  onRetry?: () => void;
}

export const ActivityErrorState: React.FC<ActivityErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="p-6 text-center border border-zinc-800/80 rounded-lg space-y-3 select-none">
      <p className="text-xs text-zinc-400 font-mono">Unable to load recent activity timeline.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={RefreshIcon} size={14} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ActivityErrorState;
