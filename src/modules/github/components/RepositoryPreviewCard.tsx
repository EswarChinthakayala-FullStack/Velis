import React from 'react';
import { motion } from 'framer-motion';
import type { GitHubRepoMetadata } from '../types/github';
import { VisibilityBadge } from './VisibilityBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  StarIcon,
  GitForkIcon,
  GitBranchIcon,
  CodeCircleIcon,
  Calendar01Icon,
} from '@hugeicons/core-free-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface RepositoryPreviewCardProps {
  metadata: GitHubRepoMetadata | null;
  isLoading?: boolean;
}

export const RepositoryPreviewCard: React.FC<RepositoryPreviewCardProps> = ({ metadata, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 animate-pulse space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-800" />
          <div className="space-y-1 flex-1">
            <div className="h-4 w-3/4 bg-zinc-800 rounded" />
            <div className="h-3 w-1/2 bg-zinc-800/60 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!metadata) return null;

  const formattedUpdate = metadata.updated_at
    ? formatDistanceToNow(parseISO(metadata.updated_at), { addSuffix: true })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/90 shadow-lg backdrop-blur-xl space-y-3 font-mono text-xs select-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={metadata.owner.avatar_url}
            alt={metadata.owner.login}
            className="w-10 h-10 rounded-lg border border-zinc-800 object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white tracking-tight truncate text-sm">
                {metadata.full_name}
              </span>
              <VisibilityBadge visibility={metadata.private ? 'private' : 'public'} />
            </div>
            <span className="text-[11px] text-zinc-500 block truncate">
              Owner: <span className="text-zinc-300">{metadata.owner.login}</span>
            </span>
          </div>
        </div>
      </div>

      {metadata.description && (
        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
          {metadata.description}
        </p>
      )}

      {/* Metrics & Metadata Pills */}
      <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400">
        {metadata.language && (
          <div className="flex items-center gap-1 text-amber-300">
            <HugeiconsIcon icon={CodeCircleIcon} size={12} />
            <span>{metadata.language}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-zinc-300">
          <HugeiconsIcon icon={GitBranchIcon} size={12} className="text-zinc-500" />
          <span>{metadata.default_branch || 'main'}</span>
        </div>

        <div className="flex items-center gap-1 text-zinc-300">
          <HugeiconsIcon icon={StarIcon} size={12} className="text-amber-400" />
          <span>{metadata.stargazers_count ?? 0}</span>
        </div>

        <div className="flex items-center gap-1 text-zinc-300">
          <HugeiconsIcon icon={GitForkIcon} size={12} className="text-blue-400" />
          <span>{metadata.forks_count ?? 0}</span>
        </div>

        {formattedUpdate && (
          <div className="flex items-center gap-1 text-zinc-500 ml-auto">
            <HugeiconsIcon icon={Calendar01Icon} size={12} />
            <span>Updated {formattedUpdate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RepositoryPreviewCard;
