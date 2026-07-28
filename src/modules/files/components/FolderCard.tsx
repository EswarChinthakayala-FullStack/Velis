import React from 'react';
import { motion } from 'framer-motion';
import type { FolderItem } from '../lib/types/file';
import { HugeiconsIcon } from '@hugeicons/react';
import { Folder01Icon, Delete02Icon } from '@hugeicons/core-free-icons';

interface FolderCardProps {
  folder: FolderItem;
  onOpenFolder: (folder: FolderItem) => void;
  onDeleteFolder?: (folderId: string) => void;
  readOnly?: boolean;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onOpenFolder,
  onDeleteFolder,
  readOnly = false,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onOpenFolder(folder)}
      className="group relative p-3.5 rounded-lg bg-[#0c0c0e]/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-150 cursor-pointer shadow-sm flex items-center justify-between gap-3 select-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-amber-400 group-hover:text-amber-300 transition-colors shrink-0">
          <HugeiconsIcon icon={Folder01Icon} size={18} />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-white truncate font-sans tracking-tight">
            {folder.name}
          </h4>
          <span className="text-[10px] text-zinc-500 font-mono">Folder</span>
        </div>
      </div>

      {!readOnly && onDeleteFolder && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Delete folder "${folder.name}"?`)) {
              onDeleteFolder(folder.id);
            }
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-rose-900/60 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
          title="Delete folder"
        >
          <HugeiconsIcon icon={Delete02Icon} size={13} />
        </button>
      )}
    </motion.div>
  );
};

export default FolderCard;
