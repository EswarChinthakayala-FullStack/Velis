import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Task01Icon, Add01Icon, Menu01Icon, Layout01Icon } from '@hugeicons/core-free-icons';

interface TasksHeaderProps {
  totalTasks: number;
  viewMode: 'table' | 'kanban';
  onViewModeChange: (mode: 'table' | 'kanban') => void;
  onOpenCreateModal: () => void;
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({
  totalTasks,
  viewMode,
  onViewModeChange,
  onOpenCreateModal,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 font-mono select-none">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
            <HugeiconsIcon icon={Task01Icon} size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 truncate">
            <span>Tasks Workspace</span>
            <span className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
              {totalTasks}
            </span>
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mt-1 truncate">
          Manage, prioritize, and track project task execution from one central internal workspace.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* View Switcher Toggle: Table vs Kanban Cards */}
        <div className="flex items-center p-0.5 rounded-sm bg-zinc-900 border border-zinc-800">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`h-8 px-2.5 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="TanStack Table View"
          >
            <HugeiconsIcon icon={Menu01Icon} size={14} />
            <span className="hidden sm:inline">Table</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('kanban')}
            className={`h-8 px-2.5 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Kanban Board Card View"
          >
            <HugeiconsIcon icon={Layout01Icon} size={14} />
            <span className="hidden sm:inline">Board</span>
          </button>
        </div>

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

export default TasksHeader;
