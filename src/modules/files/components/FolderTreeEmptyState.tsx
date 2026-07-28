import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Folder01Icon, FolderAddIcon } from '../lib/utils/folder-icons';

interface FolderTreeEmptyStateProps {
  onCreateFolder?: () => void;
  readOnly?: boolean;
}

export const FolderTreeEmptyState: React.FC<FolderTreeEmptyStateProps> = ({
  onCreateFolder,
  readOnly = false,
}) => {
  return (
    <div className="p-4 text-center space-y-2 font-mono select-none my-2">
      <div className="w-10 h-10 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
        <HugeiconsIcon icon={Folder01Icon} size={20} />
      </div>

      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-zinc-300 font-sans">No folders yet</p>
        <p className="text-[10px] text-zinc-500 font-mono">
          Create your first folder to organize project assets.
        </p>
      </div>

      {!readOnly && onCreateFolder && (
        <button
          type="button"
          onClick={onCreateFolder}
          className="mt-1 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={FolderAddIcon} size={13} />
          <span>New Folder</span>
        </button>
      )}
    </div>
  );
};

export default FolderTreeEmptyState;
