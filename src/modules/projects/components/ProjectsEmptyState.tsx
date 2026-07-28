import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FolderCheckIcon, PlusSignIcon } from '@hugeicons/core-free-icons';

interface ProjectsEmptyStateProps {
  onNewProject: () => void;
}

export const ProjectsEmptyState: React.FC<ProjectsEmptyStateProps> = ({ onNewProject }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-zinc-800/80 rounded-xl bg-[rgba(17,17,19,0.85)] backdrop-blur-2xl space-y-4 max-w-lg mx-auto my-8 select-none">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-inner">
        <HugeiconsIcon icon={FolderCheckIcon} size={28} />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-white tracking-tight">No projects found</h3>
        <p className="text-xs text-zinc-400 font-mono">
          Create your first project to start managing deliverables, tracking timelines, and syncing GitHub code.
        </p>
      </div>

      <button
        onClick={onNewProject}
        className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-lg mt-2"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={15} />
        <span>New Project</span>
      </button>
    </div>
  );
};

export default ProjectsEmptyState;
