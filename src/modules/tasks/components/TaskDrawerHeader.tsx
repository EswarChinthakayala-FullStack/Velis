import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Task01Icon,
  Delete02Icon,
} from '@hugeicons/core-free-icons';
import type { TaskItem } from '../lib/types/task';

interface TaskDrawerHeaderProps {
  task: TaskItem;
  autoSaveStatus: 'saved' | 'saving' | 'unsaved';
  onClose: () => void;
  onDeleteTask: () => void;
}

export const TaskDrawerHeader: React.FC<TaskDrawerHeaderProps> = ({
  task,
  autoSaveStatus,
  onClose,
  onDeleteTask,
}) => {
  return (
    <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between font-mono select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
          <HugeiconsIcon icon={Task01Icon} size={18} />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">
              {task.projectName || 'Unassigned Project'}
            </span>
            {autoSaveStatus === 'saving' && (
              <span className="text-[10px] text-amber-400 font-mono font-bold animate-pulse">
                Saving...
              </span>
            )}
            {autoSaveStatus === 'saved' && (
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Saved</span>
            )}
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {task.title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onDeleteTask}
          className="p-1.5 rounded-sm text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
          title="Delete Task"
        >
          <HugeiconsIcon icon={Delete02Icon} size={16} />
        </button>

        <button
          onClick={onClose}
          className="p-1.5 rounded-sm text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          title="Close Drawer"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskDrawerHeader;
