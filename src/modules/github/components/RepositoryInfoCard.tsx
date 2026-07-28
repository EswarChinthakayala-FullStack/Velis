import React from 'react';
import type { GitHubRepoMetadata } from '../types/github';
import { format, parseISO } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  InformationCircleIcon,
  GitBranchIcon,
  SecurityIcon,
  Time01Icon,
  HardDriveIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';

interface RepositoryInfoCardProps {
  metadata: GitHubRepoMetadata | null;
  isLoading?: boolean;
}

export const RepositoryInfoCard: React.FC<RepositoryInfoCardProps> = ({ metadata, isLoading }) => {
  if (isLoading || !metadata) {
    return <div className="h-44 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />;
  }

  const formattedCreated = metadata.created_at ? format(parseISO(metadata.created_at), 'MMM d, yyyy') : 'N/A';
  const formattedPushed = metadata.pushed_at ? format(parseISO(metadata.pushed_at), 'MMM d, yyyy HH:mm') : 'N/A';
  const sizeMB = (metadata.size / 1024).toFixed(2);

  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={InformationCircleIcon} size={15} className="text-zinc-400" />
          <span>Repository Overview</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">ID: {metadata.id}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
          <span className="text-zinc-500 text-[10px] block">Owner</span>
          <span className="text-zinc-200 font-semibold truncate block">{metadata.owner.login}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
          <span className="text-zinc-500 text-[10px] block">Default Branch</span>
          <span className="text-amber-400 font-semibold truncate block flex items-center gap-1">
            <HugeiconsIcon icon={GitBranchIcon} size={12} />
            <span>{metadata.default_branch}</span>
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
          <span className="text-zinc-500 text-[10px] block">License</span>
          <span className="text-zinc-200 font-semibold truncate block">
            {metadata.license?.spdx_id || metadata.license?.name || 'No License'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
          <span className="text-zinc-500 text-[10px] block">Size</span>
          <span className="text-zinc-200 font-semibold truncate block flex items-center gap-1">
            <HugeiconsIcon icon={HardDriveIcon} size={12} className="text-zinc-500" />
            <span>{sizeMB} MB</span>
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
          <span className="text-zinc-500 text-[10px] block">Created Date</span>
          <span className="text-zinc-300 font-semibold truncate block">{formattedCreated}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
          <span className="text-zinc-500 text-[10px] block">Last Push</span>
          <span className="text-zinc-300 font-semibold truncate block">{formattedPushed}</span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInfoCard;
