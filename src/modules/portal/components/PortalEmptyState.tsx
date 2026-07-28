import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FolderCheckIcon } from '@hugeicons/core-free-icons';

interface PortalEmptyStateProps {
  title?: string;
  message?: string;
}

export const PortalEmptyState: React.FC<PortalEmptyStateProps> = ({
  title = 'No Items Available',
  message = 'No records have been shared for this project section yet.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-[#0c0c0e]/60 border border-zinc-800/80 shadow-inner my-6 select-none font-sans">
      <div className="p-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mb-3">
        <HugeiconsIcon icon={FolderCheckIcon} size={28} />
      </div>
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 max-w-sm">{message}</p>
    </div>
  );
};
