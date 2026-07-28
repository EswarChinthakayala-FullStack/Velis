import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitBranchIcon, Calendar01Icon, UserGroupIcon } from '@hugeicons/core-free-icons';
import type { ProjectItem } from '../../../types/project';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectPriorityBadge } from './ProjectPriorityBadge';
import { ProjectProgress } from './ProjectProgress';
import { ProjectActionsMenu } from './ProjectActionsMenu';
import { TechnologyChip } from './TechnologyChip';

interface ProjectCardProps {
  project: ProjectItem;
  onEdit?: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formatDeadline = (deadlineStr?: string) => {
    if (!deadlineStr) return null;
    try {
      const days = differenceInDays(parseISO(deadlineStr), new Date());
      if (days < 0) return `Overdue by ${Math.abs(days)} days`;
      if (days === 0) return 'Due today';
      return `Due in ${days} days`;
    } catch {
      return null;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const deadlineLabel = formatDeadline(project.deadline);

  return (
    <div
      onClick={() => navigate(`/app/projects/${project.id}`)}
      className="group relative flex flex-col justify-between p-5 rounded-lg bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 hover:border-zinc-700/80 backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none overflow-hidden"
    >
      <div className="space-y-3.5">
        {/* Header: Title + Dynamic Database Colored Glassy Badge + Menu Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white group-hover:text-zinc-100 tracking-tight truncate leading-tight">
                {project.name}
              </h3>

              {/* Dynamic Database Accent Color Glassy Badge */}
              <span
                className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border shrink-0 backdrop-blur-md transition-colors"
                style={{
                  backgroundColor: project.color ? `${project.color}22` : 'rgba(255,255,255,0.06)',
                  borderColor: project.color ? `${project.color}55` : 'rgba(255,255,255,0.15)',
                  color: project.color || '#FAFAFA',
                }}
              >
                {getInitials(project.name)}
              </span>
            </div>

            {project.clientName && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono truncate">
                <HugeiconsIcon icon={UserGroupIcon} size={13} className="text-zinc-500 shrink-0" />
                <span className="truncate">{project.clientName}</span>
              </div>
            )}
          </div>

          <ProjectActionsMenu project={project} onEdit={() => onEdit?.(project)} />
        </div>

        {/* Description Snippet */}
        {project.description && (
          <p className="text-xs text-zinc-400 font-normal line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Status & Priority Badges */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <ProjectStatusBadge status={project.status} />
          <ProjectPriorityBadge priority={project.priority} />
          {deadlineLabel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono rounded-md bg-zinc-900/90 text-zinc-400 border border-zinc-800">
              <HugeiconsIcon icon={Calendar01Icon} size={11} className="text-zinc-500" />
              <span>{deadlineLabel}</span>
            </span>
          )}
        </div>

        {/* Completion Progress Bar */}
        <ProjectProgress percent={project.completionPercent} />

        {/* Technologies Chips */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            {project.technologies.map((t) => (
              <TechnologyChip key={t.id} name={t.name} iconUrl={t.iconUrl} size="sm" />
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: GitHub & Relative Timestamp */}
      <div className="flex items-center justify-between gap-2 pt-3.5 mt-3.5 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500">
        {project.githubRepo ? (
          <div className="flex items-center gap-1.5 text-zinc-300 truncate">
            <HugeiconsIcon icon={GitBranchIcon} size={13} className="text-zinc-400 shrink-0" />
            <span className="truncate font-semibold">{project.githubRepo.repoUrl.split('/').pop()}</span>
          </div>
        ) : (
          <span className="text-zinc-500 italic">Not Connected</span>
        )}

        <span className="shrink-0">{formatTime(project.updatedAt)}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
