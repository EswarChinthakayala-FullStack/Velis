import React, { useState } from 'react';
import type { TaskItem, TaskPriority, TaskStatus } from '../lib/types/task';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskProgressSlider } from './TaskProgressSlider';
import { DatePicker } from '../../../components/ui/date-picker';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  FilterIcon,
  Tag01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';

interface TaskDrawerMetadataProps {
  task: TaskItem;
  onChangeStatus: (status: TaskStatus) => void;
  onChangePriority: (priority: TaskPriority) => void;
  onChangeModule: (module: string) => void;
  onChangeDueDate: (dueDate: string) => void;
  onChangeProgress: (progress: number) => void;
  onChangeLabels: (labels: string[]) => void;
}

export const TaskDrawerMetadata: React.FC<TaskDrawerMetadataProps> = ({
  task,
  onChangeStatus,
  onChangePriority,
  onChangeModule,
  onChangeDueDate,
  onChangeProgress,
  onChangeLabels,
}) => {
  const [labelInput, setLabelInput] = useState('');

  const handleAddLabel = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && labelInput.trim()) {
      e.preventDefault();
      const cleaned = labelInput.trim().replace(/^#/, '');
      if (cleaned && !task.labels.includes(cleaned)) {
        onChangeLabels([...task.labels, cleaned]);
      }
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    onChangeLabels(task.labels.filter((l) => l !== label));
  };

  return (
    <div className="p-4 rounded-sm bg-zinc-900/40 border border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs select-none">
      {/* 1. Execution Status */}
      <div className="space-y-1.5">
        <label className="font-semibold text-zinc-400 text-[11px]">Execution Status</label>
        <div>
          <TaskStatusBadge status={task.status} onChangeStatus={onChangeStatus} />
        </div>
      </div>

      {/* 2. Priority Level */}
      <div className="space-y-1.5">
        <label className="font-semibold text-zinc-400 text-[11px]">Priority Level</label>
        <div>
          <TaskPriorityBadge priority={task.priority} onChangePriority={onChangePriority} />
        </div>
      </div>

      {/* 3. Module Name */}
      <div className="space-y-1.5">
        <label className="font-semibold text-zinc-400 text-[11px]">Module / Component</label>
        <input
          type="text"
          value={task.module || ''}
          onChange={(e) => onChangeModule(e.target.value)}
          placeholder="e.g. Frontend, Backend, API"
          className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
        />
      </div>

      {/* 4. Due Date */}
      <div className="space-y-1.5">
        <label className="font-semibold text-zinc-400 text-[11px]">Due Date</label>
        <DatePicker
          value={task.dueDate || ''}
          onChange={(val: any) => onChangeDueDate(String(val))}
          className="w-full h-8 bg-zinc-900 border-zinc-800 rounded-sm text-xs text-white"
        />
      </div>

      {/* 5. Progress Bar */}
      <div className="space-y-1.5 sm:col-span-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-zinc-400 text-[11px]">Progress Metric</label>
          <span className="text-[10px] text-zinc-500">{task.progress}%</span>
        </div>
        <TaskProgressSlider progress={task.progress} onChangeProgress={onChangeProgress} />
      </div>

      {/* 6. Labels */}
      <div className="space-y-1.5 sm:col-span-2">
        <label className="font-semibold text-zinc-400 text-[11px]">Labels</label>
        <div className="space-y-1.5">
          <input
            type="text"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={handleAddLabel}
            placeholder="Type label & press enter..."
            className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
          />

          {task.labels.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              {task.labels.map((l) => (
                <span
                  key={l}
                  className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] flex items-center gap-1 font-mono"
                >
                  <span>#{l}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(l)}
                    className="hover:text-white"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDrawerMetadata;
