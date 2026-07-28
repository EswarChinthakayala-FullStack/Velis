import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  AlertCircleIcon,
  Flag01Icon,
  CircleIcon,
} from '@hugeicons/core-free-icons';
import type { TaskPriority, TaskStatus } from '../types/task';

export interface PriorityConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export interface StatusConfig {
  label: string;
  icon: any;
  badgeClass: string;
}

export const PRIORITY_CONFIGS: Record<TaskPriority, PriorityConfig> = {
  urgent: {
    label: 'Critical',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dotClass: 'bg-rose-500',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotClass: 'bg-blue-500',
  },
  low: {
    label: 'Low',
    badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700/60',
    dotClass: 'bg-zinc-500',
  },
};

export const STATUS_CONFIGS: Record<TaskStatus, StatusConfig> = {
  todo: {
    label: 'Todo',
    icon: CircleIcon,
    badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-700/80',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock01Icon,
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  review: {
    label: 'In Review',
    icon: Flag01Icon,
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  testing: {
    label: 'Testing',
    icon: AlertCircleIcon,
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  completed: {
    label: 'Completed',
    icon: CheckmarkCircle02Icon,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
};

export function getPriorityConfig(priority: TaskPriority): PriorityConfig {
  return PRIORITY_CONFIGS[priority] || PRIORITY_CONFIGS.medium;
}

export function getStatusConfig(status: TaskStatus): StatusConfig {
  return STATUS_CONFIGS[status] || STATUS_CONFIGS.todo;
}
