import React from 'react';
import type { ShareLinkStatus } from '../lib/types/share-link';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, Time01Icon, CancelCircleIcon, LockKeyIcon } from '@hugeicons/core-free-icons';

interface ShareLinkStatusBadgeProps {
  status: ShareLinkStatus;
}

export const ShareLinkStatusBadge: React.FC<ShareLinkStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-100 font-mono text-[10px] uppercase font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>Active</span>
        </span>
      );
    case 'protected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 font-mono text-[10px] uppercase font-medium">
          <HugeiconsIcon icon={LockKeyIcon} size={11} className="text-amber-400 shrink-0" />
          <span>Protected</span>
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase font-medium">
          <HugeiconsIcon icon={Time01Icon} size={11} className="text-zinc-500 shrink-0" />
          <span>Expired</span>
        </span>
      );
    case 'disabled':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900/60 border border-zinc-800/60 text-zinc-500 font-mono text-[10px] uppercase font-medium">
          <HugeiconsIcon icon={CancelCircleIcon} size={11} className="text-zinc-600 shrink-0" />
          <span>Disabled</span>
        </span>
      );
  }
};
