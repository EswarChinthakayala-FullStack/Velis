import React from 'react';
import type { ProjectStatus } from '../../../types/project';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  const isActive = status === 'active';
  const isPlanning = status === 'planning';
  const isOnHold = status === 'on_hold';
  const isCompleted = status === 'completed';

  const label =
    status === 'active'
      ? 'Active'
      : status === 'planning'
      ? 'Planning'
      : status === 'on_hold'
      ? 'On Hold'
      : status === 'completed'
      ? 'Completed'
      : 'Cancelled';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full border whitespace-nowrap shrink-0 uppercase tracking-wider backdrop-blur-md transition-colors ${
        isActive
          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
          : isPlanning
          ? 'bg-sky-950/60 text-sky-300 border-sky-800/70'
          : isOnHold
          ? 'bg-amber-950/60 text-amber-300 border-amber-800/70'
          : isCompleted
          ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/70'
          : 'bg-rose-950/50 text-rose-300 border-rose-800/60'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive
            ? 'bg-emerald-400 animate-pulse'
            : isPlanning
            ? 'bg-sky-400'
            : isOnHold
            ? 'bg-amber-400'
            : isCompleted
            ? 'bg-indigo-400'
            : 'bg-rose-400'
        }`}
      />
      <span>{label}</span>
    </span>
  );
};

export default ProjectStatusBadge;
