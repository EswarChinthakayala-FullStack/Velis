import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Task01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface TaskEmptyStateProps {
  onOpenCreateModal: () => void;
  isSearchFiltered?: boolean;
  onResetFilters?: () => void;
}

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({
  onOpenCreateModal,
  isSearchFiltered = false,
  onResetFilters,
}) => {
  return (
    <div className="p-12 rounded-sm bg-[#0c0c0e]/90 border border-zinc-800/90 text-center font-mono select-none space-y-4">
      <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400 shadow-sm">
        <HugeiconsIcon icon={Task01Icon} size={24} />
      </div>

      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-base font-bold text-white tracking-tight">
          {isSearchFiltered ? 'No matching tasks found' : 'No tasks created yet'}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {isSearchFiltered
            ? 'No workspace tasks match your active filter criteria. Try resetting filters or adjusting search terms.'
            : 'Create your first project task to begin tracking execution deliverables, priority levels, and progress.'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        {isSearchFiltered && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="h-9 px-4 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        )}

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="h-9 px-4 rounded-sm bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-xs flex items-center gap-2 cursor-pointer shadow-md"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          <span>Create Task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskEmptyState;
