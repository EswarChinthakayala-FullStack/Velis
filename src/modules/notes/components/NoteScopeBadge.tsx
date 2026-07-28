import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Folder01Icon, UserGroupIcon, ShieldKeyIcon } from '@hugeicons/core-free-icons';

interface NoteScopeBadgeProps {
  projectName?: string;
  clientName?: string;
}

export const NoteScopeBadge: React.FC<NoteScopeBadgeProps> = ({ projectName, clientName }) => {
  if (!projectName && !clientName) {
    return (
      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-mono inline-flex items-center gap-1">
        <HugeiconsIcon icon={ShieldKeyIcon} size={11} className="text-zinc-500" />
        <span>Standalone Private Note</span>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono select-none">
      {projectName && (
        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 inline-flex items-center gap-1">
          <HugeiconsIcon icon={Folder01Icon} size={11} className="text-zinc-400" />
          <span className="truncate max-w-[140px]">{projectName}</span>
        </span>
      )}

      {clientName && (
        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 inline-flex items-center gap-1">
          <HugeiconsIcon icon={UserGroupIcon} size={11} className="text-zinc-400" />
          <span className="truncate max-w-[140px]">{clientName}</span>
        </span>
      )}
    </div>
  );
};
