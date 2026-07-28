import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Link01Icon,
  Time01Icon,
  CancelCircleIcon,
  EyeIcon,
  Clock01Icon,
  LockKeyIcon,
} from '@hugeicons/core-free-icons';
import type { ShareLinkStats } from '../lib/types/share-link';

interface ShareLinksStatsProps {
  stats: ShareLinkStats;
}

export const ShareLinksStats: React.FC<ShareLinksStatsProps> = ({ stats }) => {
  const lastAccessFormatted = stats.lastAccessedAt
    ? `${formatDistanceToNow(new Date(stats.lastAccessedAt))} ago`
    : 'Never';

  const statItems = [
    {
      title: 'Active Links',
      value: stats.activeCount,
      icon: Link01Icon,
      accent: 'text-zinc-200',
    },
    {
      title: 'Expired Links',
      value: stats.expiredCount,
      icon: Time01Icon,
      accent: 'text-zinc-400',
    },
    {
      title: 'Disabled Links',
      value: stats.disabledCount,
      icon: CancelCircleIcon,
      accent: 'text-zinc-500',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: EyeIcon,
      accent: 'text-white',
    },
    {
      title: 'Last Access',
      value: lastAccessFormatted,
      icon: Clock01Icon,
      accent: 'text-zinc-300',
      isText: true,
    },
    {
      title: 'Password Protected',
      value: stats.passwordProtectedCount,
      icon: LockKeyIcon,
      accent: 'text-zinc-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {statItems.map((item, i) => (
        <div
          key={i}
          className="p-3.5 rounded-xl bg-[#0c0c0e]/90 border border-zinc-800/80 shadow-md flex flex-col justify-between space-y-2 select-none"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-sans font-medium text-zinc-400 truncate">{item.title}</span>
            <HugeiconsIcon icon={item.icon} size={15} className="shrink-0 text-zinc-500" />
          </div>

          <div className={`font-mono ${item.isText ? 'text-xs font-medium truncate' : 'text-xl font-bold'} ${item.accent}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};
