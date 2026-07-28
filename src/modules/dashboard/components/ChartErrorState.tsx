import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { RefreshIcon } from '@hugeicons/core-free-icons';

interface ChartErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ChartErrorState: React.FC<ChartErrorStateProps> = ({
  message = 'Unable to load chart data.',
  onRetry,
}) => {
  return (
    <div className="h-48 w-full flex flex-col items-center justify-center p-6 text-center space-y-3 select-none">
      <p className="text-xs text-zinc-400 font-mono">{message}</p>
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

export default ChartErrorState;
