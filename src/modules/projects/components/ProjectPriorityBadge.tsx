import React from 'react';
import type { ProjectPriority } from '../../../types/project';

interface ProjectPriorityBadgeProps {
  priority: ProjectPriority;
}

export const ProjectPriorityBadge: React.FC<ProjectPriorityBadgeProps> = ({ priority }) => {
  const isUrgent = priority === 'urgent';
  const isHigh = priority === 'high';
  const isMedium = priority === 'medium';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md border uppercase whitespace-nowrap shrink-0 backdrop-blur-md transition-colors ${
        isUrgent
          ? 'bg-rose-950/60 text-rose-300 border-rose-800/70 font-bold'
          : isHigh
          ? 'bg-orange-950/60 text-orange-300 border-orange-800/70'
          : isMedium
          ? 'bg-amber-950/60 text-amber-300 border-amber-800/70'
          : 'bg-slate-900/90 text-slate-300 border-slate-700/80'
      }`}
    >
      {priority}
    </span>
  );
};

export default ProjectPriorityBadge;
