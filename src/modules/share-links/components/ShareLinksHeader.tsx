import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Share01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface ShareLinksHeaderProps {
  onOpenGenerateDialog: () => void;
}

export const ShareLinksHeader: React.FC<ShareLinksHeaderProps> = ({ onOpenGenerateDialog }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">
            <HugeiconsIcon icon={Share01Icon} size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">Share Links</h1>
        </div>
        <p className="text-xs text-zinc-400 font-sans max-w-xl">
          Generate secure read-only portals for clients without requiring authentication.
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenGenerateDialog}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-sans font-medium text-xs hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer shrink-0"
      >
        <HugeiconsIcon icon={Add01Icon} size={16} />
        <span>Generate Share Link</span>
      </button>
    </div>
  );
};
