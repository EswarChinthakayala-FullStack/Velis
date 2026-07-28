import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

interface ProjectDrawerHeaderProps {
  mode: 'create' | 'edit';
  onClose: () => void;
}

export const ProjectDrawerHeader: React.FC<ProjectDrawerHeaderProps> = ({ mode, onClose }) => {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80 bg-[#0E0E10] shrink-0">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          {mode === 'create' ? 'New Project' : 'Edit Project'}
        </h2>
        <p className="text-xs text-zinc-400 font-mono">
          Configure project information, timeline, and client association.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        title="Close Drawer"
        aria-label="Close Drawer"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={18} />
      </button>
    </div>
  );
};

export default ProjectDrawerHeader;
