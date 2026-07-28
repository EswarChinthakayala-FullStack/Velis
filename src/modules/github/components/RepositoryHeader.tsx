import React from 'react';
import type { GitHubRepoMetadata } from '../types/github';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  GitBranchIcon,
  Link01Icon,
  CodeCircleIcon,
} from '@hugeicons/core-free-icons';

interface RepositoryHeaderProps {
  metadata: GitHubRepoMetadata | null;
  isLoading?: boolean;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({ metadata, isLoading }) => {
  if (isLoading || !metadata) {
    return (
      <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-zinc-800 rounded" />
            <div className="h-3 w-32 bg-zinc-800/60 rounded" />
          </div>
        </div>
        <div className="h-8 w-28 bg-zinc-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl flex items-center justify-between gap-3 sm:gap-4 select-none min-w-0">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {/* Repo Avatar */}
        <img
          src={metadata.owner.avatar_url}
          alt={metadata.owner.login}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-zinc-800 object-cover shrink-0 shadow-inner"
        />

        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate font-mono">
              {metadata.full_name}
            </h2>

            {/* Visibility Badge */}
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 uppercase shrink-0">
              {metadata.private ? 'Private' : 'Public'}
            </span>

            {/* Language Badge */}
            {metadata.language && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1 shrink-0">
                <HugeiconsIcon icon={CodeCircleIcon} size={11} />
                <span>{metadata.language}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400 font-mono truncate max-w-xl">
            {metadata.description || 'No description provided for this repository.'}
          </p>
        </div>
      </div>

      {/* External Link Button (Icon only on mobile, text on sm+) */}
      <a
        href={metadata.html_url}
        target="_blank"
        rel="noreferrer"
        className="h-9 px-2.5 sm:px-4 flex items-center justify-center gap-2 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-colors cursor-pointer text-xs font-mono shrink-0 shadow-md"
        title="Open on GitHub"
      >
        <span className="hidden sm:inline">Open on GitHub</span>
        <HugeiconsIcon icon={Link01Icon} size={15} />
      </a>
    </div>
  );
};

export default RepositoryHeader;
