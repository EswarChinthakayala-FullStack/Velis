import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Share01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface EmptyShareLinksProps {
  onGenerate: () => void;
}

export const EmptyShareLinks: React.FC<EmptyShareLinksProps> = ({ onGenerate }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-[#0c0c0e]/60 border border-zinc-800/80 shadow-inner my-4 select-none">
      <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mb-4 shadow-lg">
        <HugeiconsIcon icon={Share01Icon} size={32} />
      </div>

      <h3 className="text-base font-semibold text-white font-sans mb-1">
        No Share Links Created
      </h3>
      <p className="text-xs text-zinc-400 font-sans max-w-sm mb-6">
        Generate secure read-only client access links for this project without requiring authentication.
      </p>

      <button
        type="button"
        onClick={onGenerate}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-sans font-medium text-xs hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
      >
        <HugeiconsIcon icon={Add01Icon} size={16} />
        <span>Generate First Link</span>
      </button>
    </div>
  );
};
