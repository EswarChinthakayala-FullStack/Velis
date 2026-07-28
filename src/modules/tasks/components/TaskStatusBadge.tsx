import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import type { TaskStatus } from '../lib/types/task';
import { STATUS_CONFIGS, getStatusConfig } from '../lib/utils/task-formatters';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  onChangeStatus?: (newStatus: TaskStatus) => void;
  disabled?: boolean;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  onChangeStatus,
  disabled = false,
}) => {
  const config = getStatusConfig(status);

  if (!onChangeStatus || disabled) {
    return (
      <span
        className={`px-2 py-0.5 rounded-sm border text-[10px] font-mono font-medium flex items-center gap-1.5 shrink-0 ${config.badgeClass}`}
      >
        <HugeiconsIcon icon={config.icon} size={11} />
        <span>{config.label}</span>
      </span>
    );
  }

  return (
    <Select value={status} onValueChange={(val: any) => onChangeStatus(val as TaskStatus)}>
      <SelectTrigger className={`h-6 px-2 border rounded-sm text-[10px] font-mono font-medium flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity border-transparent ${config.badgeClass}`}>
        <SelectValue>
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={config.icon} size={11} />
            <span>{config.label}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
        {Object.entries(STATUS_CONFIGS).map(([key, cfg]) => (
          <SelectItem key={key} value={key} className="font-mono text-xs rounded-sm">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={cfg.icon} size={12} />
              <span>{cfg.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskStatusBadge;
