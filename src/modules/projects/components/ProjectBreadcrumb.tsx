import React from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Folder01Icon } from '@hugeicons/core-free-icons';

interface ProjectBreadcrumbProps {
  projectName?: string;
  activeSectionName?: string;
}

export const ProjectBreadcrumb: React.FC<ProjectBreadcrumbProps> = ({
  projectName,
  activeSectionName,
}) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 select-none pb-2">
      <Link
        to="/app/projects"
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        <HugeiconsIcon icon={Folder01Icon} size={14} className="text-zinc-500" />
        <span>Projects</span>
      </Link>

      {projectName && (
        <>
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-zinc-600" />
          <span className="text-zinc-300 truncate max-w-[200px] font-medium">{projectName}</span>
        </>
      )}

      {activeSectionName && (
        <>
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-zinc-600" />
          <span className="text-white font-bold tracking-tight">{activeSectionName}</span>
        </>
      )}
    </nav>
  );
};

export default ProjectBreadcrumb;
