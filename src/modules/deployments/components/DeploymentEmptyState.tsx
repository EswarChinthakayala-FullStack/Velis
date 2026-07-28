import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { RocketIcon, Add01Icon } from '@hugeicons/core-free-icons';

interface DeploymentEmptyStateProps {
  isSearchFiltered?: boolean;
  onResetFilters?: () => void;
  onOpenCreateModal?: () => void;
  readOnly?: boolean;
}

export const DeploymentEmptyState: React.FC<DeploymentEmptyStateProps> = ({
  isSearchFiltered = false,
  onResetFilters,
  onOpenCreateModal,
  readOnly = false,
}) => {
  return (
    <div className="p-8 sm:p-12 rounded-xl bg-[#0c0c0e]/80 border border-zinc-800/80 text-center font-mono space-y-4 max-w-xl mx-auto my-6 shadow-2xl select-none">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400 shadow-inner">
        <HugeiconsIcon icon={RocketIcon} size={28} />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-white font-sans">
          {isSearchFiltered ? 'No matching deployment environments found' : 'No deployment environments configured'}
        </h3>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-sm mx-auto">
          {isSearchFiltered
            ? 'Try adjusting your search query or clear your environment and health filters.'
            : 'Track production, staging, and preview deployment URLs with health indicators and release history.'}
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
          <span>Add First Environment</span>
        </button>
      ) : null}
    </div>
  );
};
