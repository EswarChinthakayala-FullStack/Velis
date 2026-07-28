import React from 'react';
import type { MilestoneStatus } from '../lib/types/milestone';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';

interface MilestoneStatusBadgeProps {
  status: MilestoneStatus;
  onChangeStatus?: (status: MilestoneStatus) => void;
  disabled?: boolean;
}

export function getMilestoneStatusConfig(status: MilestoneStatus) {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      };
    case 'blocked':
      return {
        label: 'Blocked',
        badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      };
    case 'planned':
    default:
      return {
        label: 'Planned',
        badgeClass: 'bg-zinc-900 text-zinc-400 border-zinc-800',
      };
  }
}

export const MilestoneStatusBadge: React.FC<MilestoneStatusBadgeProps> = ({
  status,
  onChangeStatus,
  disabled = false,
}) => {
  const config = getMilestoneStatusConfig(status);

  if (disabled || !onChangeStatus) {
    return (
      <span
        className={`px-2 py-0.5 rounded-sm border font-mono text-[10px] font-bold ${config.badgeClass}`}
      >
        {config.label}
      </span>
    );
  }

  return (
    <Select value={status} onValueChange={(val: any) => onChangeStatus(val as MilestoneStatus)}>
      <SelectTrigger
        className={`h-7 px-2 border rounded-sm font-mono text-[10px] font-bold w-[110px] ${config.badgeClass}`}
      >
        <SelectValue>{config.label}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
        <SelectItem value="planned" className="font-mono text-xs rounded-sm">Planned</SelectItem>
        <SelectItem value="in_progress" className="font-mono text-xs rounded-sm">In Progress</SelectItem>
        <SelectItem value="blocked" className="font-mono text-xs rounded-sm">Blocked</SelectItem>
        <SelectItem value="completed" className="font-mono text-xs rounded-sm">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default MilestoneStatusBadge;
