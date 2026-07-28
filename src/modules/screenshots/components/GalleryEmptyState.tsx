import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Image01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface GalleryEmptyStateProps {
  onUpload: () => void;
  readOnly?: boolean;
}

export const GalleryEmptyState: React.FC<GalleryEmptyStateProps> = ({
  onUpload,
  readOnly = false,
}) => {
  return (
    <div className="p-12 rounded-lg bg-[#0c0c0e]/60 border border-dashed border-zinc-800 text-center space-y-4 font-mono select-none my-6">
      <div className="w-14 h-14 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
        <HugeiconsIcon icon={Image01Icon} size={28} />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-sm font-semibold text-white font-sans">No progress screenshots yet</h3>
        <p className="text-xs text-zinc-500 font-mono">
          Capture project progress over time to build a visual timeline for your team and clients.
        </p>
      </div>

      {!readOnly && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onUpload}
            className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center gap-1.5 hover:bg-zinc-200 transition-colors cursor-pointer shadow-md"
          >
            <HugeiconsIcon icon={Add01Icon} size={14} />
            <span>Upload Progress Screenshot</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryEmptyState;
