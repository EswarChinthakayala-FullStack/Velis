import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import type { TaskPriority, TaskStatus } from '../lib/types/task';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';

interface BulkToolbarProps {
  selectedCount: number;
  onMarkCompleted: () => void;
  onChangeStatus: (status: TaskStatus) => void;
  onChangePriority: (priority: TaskPriority) => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export const BulkToolbar: React.FC<BulkToolbarProps> = ({
  selectedCount,
  onMarkCompleted,
  onChangeStatus,
  onChangePriority,
  onDeleteSelected,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-2.5 px-4 rounded-sm bg-zinc-950/95 border border-zinc-800 backdrop-blur-xl shadow-2xl flex items-center gap-3 font-mono text-xs text-white select-none"
    >
      <div className="flex items-center gap-2 pr-3 border-r border-zinc-800">
        <span className="w-5 h-5 rounded-sm bg-white text-black font-bold flex items-center justify-center text-[10px]">
          {selectedCount}
        </span>
        <span className="text-zinc-300 font-semibold">Selected</span>
      </div>

      {/* Quick Action: Mark Completed */}
      <button
        onClick={onMarkCompleted}
        className="h-8 px-3 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
        <span>Complete</span>
      </button>

      {/* Change Status */}
      <Select onValueChange={(val: any) => onChangeStatus(val as TaskStatus)}>
        <SelectTrigger className="h-8 px-3 bg-zinc-900 border-zinc-800 rounded-sm text-xs text-zinc-200 hover:border-zinc-700 min-w-[110px]">
          <SelectValue placeholder="Set Status" />
        </SelectTrigger>
        <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
          <SelectItem value="todo" className="font-mono text-xs rounded-sm">Todo</SelectItem>
          <SelectItem value="in_progress" className="font-mono text-xs rounded-sm">In Progress</SelectItem>
          <SelectItem value="review" className="font-mono text-xs rounded-sm">In Review</SelectItem>
          <SelectItem value="testing" className="font-mono text-xs rounded-sm">Testing</SelectItem>
          <SelectItem value="completed" className="font-mono text-xs rounded-sm">Completed</SelectItem>
        </SelectContent>
      </Select>

      {/* Change Priority */}
      <Select onValueChange={(val: any) => onChangePriority(val as TaskPriority)}>
        <SelectTrigger className="h-8 px-3 bg-zinc-900 border-zinc-800 rounded-sm text-xs text-zinc-200 hover:border-zinc-700 min-w-[110px]">
          <SelectValue placeholder="Set Priority" />
        </SelectTrigger>
        <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
          <SelectItem value="urgent" className="font-mono text-xs rounded-sm">Critical</SelectItem>
          <SelectItem value="high" className="font-mono text-xs rounded-sm">High</SelectItem>
          <SelectItem value="medium" className="font-mono text-xs rounded-sm">Medium</SelectItem>
          <SelectItem value="low" className="font-mono text-xs rounded-sm">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Bulk Delete */}
      <button
        onClick={onDeleteSelected}
        className="h-8 px-3 rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <HugeiconsIcon icon={Delete02Icon} size={14} />
        <span>Delete</span>
      </button>

      {/* Clear Selection */}
      <button
        onClick={onClearSelection}
        className="p-1 rounded-sm text-zinc-500 hover:text-white transition-colors"
        title="Clear selection"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={16} />
      </button>
    </motion.div>
  );
};

export default BulkToolbar;
