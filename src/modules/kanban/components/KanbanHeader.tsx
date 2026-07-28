import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Layout01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface KanbanHeaderProps {
  totalTasks: number;
  onOpenCreateModal: () => void;
}

export const KanbanHeader: React.FC<KanbanHeaderProps> = ({ totalTasks, onOpenCreateModal }) => {
  return (
    <div className="flex items-center justify-between gap-4 font-mono select-none">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
            <HugeiconsIcon icon={Layout01Icon} size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 truncate">
            <span>Kanban Board</span>
            <span className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
              {totalTasks}
            </span>
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mt-1 truncate">
          Interactive drag-and-drop workspace for visual workflow execution and task progression.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenCreateModal}
          className="h-9 px-4 rounded-sm bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
    </div>
  );
};

export default KanbanHeader;
