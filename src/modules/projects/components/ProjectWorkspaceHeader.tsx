import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon, GitBranchIcon, UserGroupIcon } from '@hugeicons/core-free-icons';
import type { ProjectItem } from '../../../types/project';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectPriorityBadge } from './ProjectPriorityBadge';

interface ProjectWorkspaceHeaderProps {
  project: ProjectItem;
  onEditProject?: () => void;
}

export const ProjectWorkspaceHeader: React.FC<ProjectWorkspaceHeaderProps> = ({
  project,
  onEditProject,
}) => {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-2.5 pb-4 border-b border-zinc-800/80 select-none min-w-0">
      {/* Top Row: Title, Badges & Action Buttons */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none truncate">
            {project.name}
          </h1>

          {/* Dynamic Glassy Initials Badge */}
          <span
            className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border shrink-0 backdrop-blur-md"
            style={{
              backgroundColor: project.color ? `${project.color}22` : 'rgba(255,255,255,0.06)',
              borderColor: project.color ? `${project.color}55` : 'rgba(255,255,255,0.15)',
              color: project.color || '#FAFAFA',
            }}
          >
            {getInitials(project.name)}
          </span>

          <ProjectStatusBadge status={project.status} />
          <ProjectPriorityBadge priority={project.priority} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {onEditProject && (
            <button
              type="button"
              onClick={onEditProject}
              className="h-8.5 px-3 flex items-center gap-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/90 text-zinc-200 hover:text-white transition-all cursor-pointer text-xs font-medium shadow-sm"
              title="Edit Project"
            >
              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
              <span className="hidden sm:inline">Edit Project</span>
            </button>
          )}

          {project.githubRepo && (
            <a
              href={project.githubRepo.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="h-8.5 px-3 flex items-center gap-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/90 text-zinc-200 hover:text-white transition-all cursor-pointer text-xs font-medium shadow-sm"
              title="View GitHub Repository"
            >
              <HugeiconsIcon icon={GitBranchIcon} size={14} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}
        </div>
      </div>

      {/* Bottom Subtitle Row: Client, Repository & Completion Progress */}
      <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono flex-wrap">
        {project.clientName && (
          <div className="flex items-center gap-1.5 text-zinc-300">
            <HugeiconsIcon icon={UserGroupIcon} size={13} className="text-zinc-500 shrink-0" />
            <span className="truncate">{project.clientName} {project.clientCompany ? `(${project.clientCompany})` : ''}</span>
          </div>
        )}

        {project.githubRepo && (
          <div className="flex items-center gap-1.5 text-zinc-400">
            <HugeiconsIcon icon={GitBranchIcon} size={13} className="text-zinc-500 shrink-0" />
            <span className="truncate">{project.githubRepo.repoUrl.split('/').pop()}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <span>Completion:</span>
          <span className="font-bold text-white">{project.completionPercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspaceHeader;
