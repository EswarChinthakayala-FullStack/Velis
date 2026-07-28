import React from 'react';
import type { FolderItem } from '../lib/types/file';
import { FolderCard } from './FolderCard';

interface FolderGridProps {
  folders: FolderItem[];
  onOpenFolder: (folder: FolderItem) => void;
  onDeleteFolder?: (folderId: string) => void;
  readOnly?: boolean;
}

export const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  onOpenFolder,
  onDeleteFolder,
  readOnly = false,
}) => {
  if (folders.length === 0) return null;

  return (
    <div className="space-y-2 mb-6 select-none">
      <h3 className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider px-1">
        Folders ({folders.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onOpenFolder={onOpenFolder}
            onDeleteFolder={onDeleteFolder}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderGrid;
