import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShieldKeyIcon, Add01Icon } from '@hugeicons/core-free-icons';

interface EmptyNotesStateProps {
  isSearchFiltered?: boolean;
  onResetFilters?: () => void;
  onOpenCreateModal?: () => void;
}

export const EmptyNotesState: React.FC<EmptyNotesStateProps> = ({
  isSearchFiltered = false,
  onResetFilters,
  onOpenCreateModal,
}) => {
  return (
    <div className="p-8 sm:p-12 rounded-xl bg-[#0c0c0e]/80 border border-zinc-800/80 text-center font-mono space-y-4 max-w-xl mx-auto my-6 shadow-2xl select-none">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400 shadow-inner">
        <HugeiconsIcon icon={ShieldKeyIcon} size={28} />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-white font-sans">
          {isSearchFiltered ? 'No matching notes found' : 'Your private second brain is empty'}
        </h3>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-sm mx-auto">
          {isSearchFiltered
            ? 'Try adjusting your search keywords or clear your category and view filters.'
            : 'Create private internal notes for meeting agendas, credentials references, architecture decisions, and follow-ups. Strictly hidden from clients.'}
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
      ) : onOpenCreateModal ? (
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="h-9 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          <span>Create First Private Note</span>
        </button>
      ) : null}
    </div>
  );
};
