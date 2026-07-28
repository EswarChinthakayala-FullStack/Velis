import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

interface KanbanEmptyStateProps {
  onAddTask: () => void;
}

export const KanbanEmptyState: React.FC<KanbanEmptyStateProps> = ({ onAddTask }) => {
  return (
    <div className="p-4 rounded-sm border border-dashed border-zinc-800 text-center font-mono select-none space-y-2 my-2">
      <p className="text-[11px] text-zinc-500">No tasks in this stage</p>
      <button
        type="button"
        onClick={onAddTask}
        className="px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] text-zinc-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
      >
        <HugeiconsIcon icon={Add01Icon} size={12} />
        <span>Add Task</span>
      </button>
    </div>
  );
};

export default KanbanEmptyState;
