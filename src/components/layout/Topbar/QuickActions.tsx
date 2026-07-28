import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlusSignIcon,
  FolderCheckIcon,
  UserGroupIcon,
  FileUploadIcon,
  Link01Icon,
} from '@hugeicons/core-free-icons';

interface QuickActionsProps {
  onOpenCreateProject?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenCreateProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-md"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={16} />
        <span className="hidden sm:inline">New Action</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-[rgba(17,17,19,0.95)] border border-zinc-800/80 rounded-lg p-1.5 backdrop-blur-2xl shadow-2xl z-50 text-xs space-y-0.5">
            <button
              onClick={() =>
                handleAction(() => {
                  if (onOpenCreateProject) onOpenCreateProject();
                  else navigate('/app/projects');
                })
              }
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors text-left"
            >
              <HugeiconsIcon icon={FolderCheckIcon} size={16} className="text-zinc-400 shrink-0" />
              <span>New Project</span>
            </button>

            <button
              onClick={() => handleAction(() => navigate('/app/clients'))}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors text-left"
            >
              <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-zinc-400 shrink-0" />
              <span>New Client</span>
            </button>

            <button
              onClick={() => handleAction(() => navigate('/app/files'))}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors text-left"
            >
              <HugeiconsIcon icon={FileUploadIcon} size={16} className="text-zinc-400 shrink-0" />
              <span>Upload File</span>
            </button>

            <button
              onClick={() => handleAction(() => navigate('/app/share-links'))}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors text-left"
            >
              <HugeiconsIcon icon={Link01Icon} size={16} className="text-zinc-400 shrink-0" />
              <span>Create Share Link</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuickActions;
