import React from 'react';
import type { FolderTreeNode } from '../lib/types/folder';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FolderAddIcon,
  Edit01Icon,
  Delete02Icon,
  RefreshIcon,
  Copy01Icon,
} from '../lib/utils/folder-icons';

interface FolderContextMenuProps {
  folder: FolderTreeNode;
  onNewSubfolder: (folder: FolderTreeNode) => void;
  onRename: (folder: FolderTreeNode) => void;
  onDelete: (folder: FolderTreeNode) => void;
  onCopyPath: (folder: FolderTreeNode) => void;
  readOnly?: boolean;
}

export const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  folder,
  onNewSubfolder,
  onRename,
  onDelete,
  onCopyPath,
  readOnly = false,
}) => {
  return (
    <div className="w-44 p-1 rounded-md bg-[#16161a] border border-zinc-700/80 shadow-2xl text-xs font-mono text-zinc-200 z-50 select-none">
      {!readOnly && (
        <button
          type="button"
          onClick={() => onNewSubfolder(folder)}
          className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-left"
        >
          <HugeiconsIcon icon={FolderAddIcon} size={14} className="text-zinc-400" />
          <span>New Subfolder</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => onCopyPath(folder)}
        className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-left"
      >
        <HugeiconsIcon icon={Copy01Icon} size={14} className="text-zinc-400" />
        <span>Copy Path</span>
      </button>

      {!readOnly && (
        <>
          <div className="my-1 border-t border-zinc-800" />

          <button
            type="button"
            onClick={() => onRename(folder)}
            className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-left"
          >
            <HugeiconsIcon icon={Edit01Icon} size={14} className="text-zinc-400" />
            <span>Rename</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(folder)}
            className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-left"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
            <span>Delete</span>
          </button>
        </>
      )}
    </div>
  );
};

export default FolderContextMenu;
