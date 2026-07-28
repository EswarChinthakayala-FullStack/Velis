import {
  CodeCircleIcon,
  Bug01Icon,
  RocketIcon,
  Flag01Icon,
  File01Icon,
  DatabaseIcon,
  CpuIcon,
  Layout01Icon,
  PaintBoardIcon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import type { TimelineUpdateType } from '../types/timeline';

export interface UpdateTypeConfig {
  label: string;
  icon: any;
  badgeClass: string;
  dotClass: string;
}

export const UPDATE_TYPE_CONFIGS: Record<TimelineUpdateType, UpdateTypeConfig> = {
  feature: {
    label: 'Feature',
    icon: CodeCircleIcon,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  bug_fix: {
    label: 'Bug Fix',
    icon: Bug01Icon,
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dotClass: 'bg-rose-500',
  },
  deployment: {
    label: 'Deployment',
    icon: RocketIcon,
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotClass: 'bg-blue-500',
  },
  milestone: {
    label: 'Milestone',
    icon: Flag01Icon,
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  documentation: {
    label: 'Docs',
    icon: File01Icon,
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    dotClass: 'bg-purple-500',
  },
  database: {
    label: 'Database',
    icon: DatabaseIcon,
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    dotClass: 'bg-cyan-500',
  },
  backend: {
    label: 'Backend',
    icon: CpuIcon,
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    dotClass: 'bg-indigo-500',
  },
  frontend: {
    label: 'Frontend',
    icon: Layout01Icon,
    badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    dotClass: 'bg-teal-500',
  },
  design: {
    label: 'Design',
    icon: PaintBoardIcon,
    badgeClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    dotClass: 'bg-pink-500',
  },
  general: {
    label: 'Update',
    icon: CheckmarkCircle02Icon,
    badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-700/60',
    dotClass: 'bg-zinc-400',
  },
};

export function getUpdateTypeConfig(type?: TimelineUpdateType): UpdateTypeConfig {
  if (!type || !UPDATE_TYPE_CONFIGS[type]) {
    return UPDATE_TYPE_CONFIGS.general;
  }
  return UPDATE_TYPE_CONFIGS[type];
}
