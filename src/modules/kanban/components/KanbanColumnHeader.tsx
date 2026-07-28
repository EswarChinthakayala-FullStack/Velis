import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import type { KanbanColumnConfig } from '../lib/types/kanban';

interface KanbanColumnHeaderProps {
  config: KanbanColumnConfig;
  count: number;
  onAddTask: () => void;
}

export const KanbanColumnHeader: React.FC<KanbanColumnHeaderProps> = ({
  config,
  count,
  onAddTask,
}) => {
  return (
    <div className={`p-3 bg-zinc-950 border-b ${config.headerColor} flex items-center justify-between font-mono select-none`}>
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">{config.title}</h3>
        <span className={`px-1.5 py-0.5 rounded-sm border text-[10px] font-bold ${config.badgeClass}`}>
          {count}
        </span>
      </div>

      <button
        onClick={onAddTask}
        className="p-1 rounded-sm text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
        title={`Add task to ${config.title}`}
      >
        <HugeiconsIcon icon={Add01Icon} size={14} />
      </button>
    </div>
  );
};

export default KanbanColumnHeader;
