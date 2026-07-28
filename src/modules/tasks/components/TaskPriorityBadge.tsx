import React from 'react';
import type { TaskPriority } from '../lib/types/task';
import { PRIORITY_CONFIGS, getPriorityConfig } from '../lib/utils/task-formatters';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  onChangePriority?: (newPriority: TaskPriority) => void;
  disabled?: boolean;
}

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({
  priority,
  onChangePriority,
  disabled = false,
}) => {
  const config = getPriorityConfig(priority);

  if (!onChangePriority || disabled) {
    return (
      <span
        className={`px-2 py-0.5 rounded-sm border text-[10px] font-mono font-medium flex items-center gap-1.5 shrink-0 ${config.badgeClass}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        <span>{config.label}</span>
      </span>
    );
  }

  return (
    <Select value={priority} onValueChange={(val: any) => onChangePriority(val as TaskPriority)}>
      <SelectTrigger className={`h-6 px-2 border rounded-sm text-[10px] font-mono font-medium flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity border-transparent ${config.badgeClass}`}>
        <SelectValue>
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
            <span>{config.label}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
        {Object.entries(PRIORITY_CONFIGS).map(([key, cfg]) => (
          <SelectItem key={key} value={key} className="font-mono text-xs rounded-sm">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
              <span>{cfg.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskPriorityBadge;
