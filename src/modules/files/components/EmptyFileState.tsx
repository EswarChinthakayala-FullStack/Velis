import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon, Upload01Icon, FolderAddIcon } from '@hugeicons/core-free-icons';

interface EmptyFileStateProps {
  onUpload: () => void;
  onCreateFolder?: () => void;
  readOnly?: boolean;
}

export const EmptyFileState: React.FC<EmptyFileStateProps> = ({
  onUpload,
  onCreateFolder,
  readOnly = false,
}) => {
  return (
    <div className="p-12 rounded-lg bg-[#0c0c0e]/60 border border-dashed border-zinc-800 text-center space-y-4 font-mono select-none my-6">
      <div className="w-14 h-14 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
        <HugeiconsIcon icon={File01Icon} size={28} />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-sm font-semibold text-white font-sans">No files or folders found</h3>
        <p className="text-xs text-zinc-500 font-mono">
          Drag and drop files anywhere to upload directly to Supabase Storage, or use the buttons below.
        </p>
      </div>

      {!readOnly && (
        <div className="flex items-center justify-center gap-3 pt-2">
          {onCreateFolder && (
            <button
              type="button"
              onClick={onCreateFolder}
              className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono hover:text-white hover:border-zinc-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <HugeiconsIcon icon={FolderAddIcon} size={14} />
              <span>New Folder</span>
            </button>
          )}

          <button
            type="button"
            onClick={onUpload}
            className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center gap-1.5 hover:bg-zinc-200 transition-colors cursor-pointer shadow-md"
          >
            <HugeiconsIcon icon={Upload01Icon} size={14} />
            <span>Upload File</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyFileState;
