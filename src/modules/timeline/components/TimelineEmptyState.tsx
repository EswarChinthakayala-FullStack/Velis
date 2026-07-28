import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface TimelineEmptyStateProps {
  onOpenCreateModal?: () => void;
  isReadOnly?: boolean;
}

export const TimelineEmptyState: React.FC<TimelineEmptyStateProps> = ({
  onOpenCreateModal,
  isReadOnly = false,
}) => {
  return (
    <div className="p-12 sm:p-16 rounded-sm bg-zinc-950/80 border border-zinc-800/80 text-center space-y-4 font-mono select-none my-6">
      <div className="w-14 h-14 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500 shadow-inner">
        <HugeiconsIcon icon={Clock01Icon} size={28} />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-base font-bold text-white tracking-tight">
          No Timeline Updates Yet
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-mono">
          Project progress and milestone entries will appear here in chronological order as work is completed.
        </p>
      </div>

      {!isReadOnly && onOpenCreateModal && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="h-9 px-5 rounded-sm bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-xs font-mono inline-flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <HugeiconsIcon icon={Add01Icon} size={16} />
            <span>Create First Update</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TimelineEmptyState;
