import React from 'react';
import type { FileItem } from '../lib/types/file';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  EyeIcon,
  Download01Icon,
  Edit01Icon,
  FolderShared01Icon,
  Copy01Icon,
  Delete02Icon,
} from '@hugeicons/core-free-icons';
import { toast } from '../../../components/ui/toast';

interface FileContextMenuProps {
  file: FileItem;
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onRename?: (file: FileItem) => void;
  onMove?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  readOnly?: boolean;
}

export const FileContextMenu: React.FC<FileContextMenuProps> = ({
  file,
  onPreview,
  onDownload,
  onRename,
  onMove,
  onDelete,
  readOnly = false,
}) => {
  const handleCopyLink = () => {
    const url = file.publicUrl || file.signedUrl || window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Direct file link copied to clipboard!');
  };

  return (
    <div className="w-44 p-1 rounded-md bg-[#16161a] border border-zinc-700/80 shadow-2xl text-xs font-mono text-zinc-200 z-50">
      <button
        type="button"
        onClick={() => onPreview(file)}
        className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-left"
      >
        <HugeiconsIcon icon={EyeIcon} size={14} className="text-zinc-400" />
        <span>Preview</span>
      </button>

      <button
        type="button"
        onClick={() => onDownload(file)}
        className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-left"
      >
        <HugeiconsIcon icon={Download01Icon} size={14} className="text-zinc-400" />
        <span>Download</span>
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-left"
      >
        <HugeiconsIcon icon={Copy01Icon} size={14} className="text-zinc-400" />
        <span>Copy Link</span>
      </button>

      {!readOnly && (
        <>
          <div className="my-1 border-t border-zinc-800" />

          {onRename && (
            <button
              type="button"
              onClick={() => onRename(file)}
              className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-left"
            >
              <HugeiconsIcon icon={Edit01Icon} size={14} className="text-zinc-400" />
              <span>Rename</span>
            </button>
          )}

          {onMove && (
            <button
              type="button"
              onClick={() => onMove(file)}
              className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-left"
            >
              <HugeiconsIcon icon={FolderShared01Icon} size={14} className="text-zinc-400" />
              <span>Move</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(file)}
              className="w-full px-2.5 py-1.5 rounded flex items-center gap-2 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-left"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
              <span>Delete</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FileContextMenu;
