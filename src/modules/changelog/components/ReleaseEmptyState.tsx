import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tag01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface ReleaseEmptyStateProps {
  isSearchFiltered?: boolean;
  onResetFilters?: () => void;
  onOpenCreateModal?: () => void;
  readOnly?: boolean;
}

export const ReleaseEmptyState: React.FC<ReleaseEmptyStateProps> = ({
  isSearchFiltered = false,
  onResetFilters,
  onOpenCreateModal,
  readOnly = false,
}) => {
  return (
    <div className="p-8 sm:p-12 rounded-xl bg-[#0c0c0e]/80 border border-zinc-800/80 text-center font-mono space-y-4 max-w-xl mx-auto my-6 shadow-2xl select-none">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400 shadow-inner">
        <HugeiconsIcon icon={Tag01Icon} size={28} />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-white font-sans">
          {isSearchFiltered ? 'No matching releases found' : 'No releases have been published yet'}
        </h3>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-sm mx-auto">
          {isSearchFiltered
            ? 'Try adjusting your search criteria or clear your release type and status filters.'
            : 'Project release history and version notes will appear here once version entries are created and published.'}
        </p>
      </div>

      {isSearchFiltered && onResetFilters ? (
        <button
          type="button"
          onClick={onResetFilters}
          className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
        >
          Reset Search Filters
        </button>
      ) : !readOnly && onOpenCreateModal ? (
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="h-9 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          <span>Create First Release</span>
        </button>
      ) : null}
    </div>
  );
};
