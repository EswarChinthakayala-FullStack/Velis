import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface TimelineHeaderProps {
  totalCount: number;
  onOpenCreateModal?: () => void;
  isReadOnly?: boolean;
  projectSelector?: React.ReactNode;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  totalCount,
  onOpenCreateModal,
  isReadOnly = false,
  projectSelector,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-zinc-800/80 select-none min-w-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
          <HugeiconsIcon icon={Clock01Icon} size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none truncate">
              Project Timeline & Journal
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono font-bold shrink-0">
              {totalCount} Updates
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono truncate hidden sm:block mt-1">
            Chronological project updates, engineering progress, releases, and development milestones.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {projectSelector}

        {!isReadOnly && onOpenCreateModal && (
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="h-9 px-2.5 sm:px-4 flex items-center justify-center gap-2 rounded-sm bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-xs font-mono shrink-0 shadow-md cursor-pointer"
            title="New Update"
          >
            <HugeiconsIcon icon={Add01Icon} size={15} />
            <span className="hidden sm:inline">New Update</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TimelineHeader;
