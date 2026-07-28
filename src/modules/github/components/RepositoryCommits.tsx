import React from 'react';
import type { GitHubCommitItem } from '../types/github';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitCommitIcon, Link01Icon } from '@hugeicons/core-free-icons';

interface RepositoryCommitsProps {
  commits: GitHubCommitItem[] | undefined;
  isLoading?: boolean;
}

export const RepositoryCommits: React.FC<RepositoryCommitsProps> = ({ commits, isLoading }) => {
  if (isLoading) {
    return <div className="h-64 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />;
  }

  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={GitCommitIcon} size={15} className="text-zinc-400" />
          <span>Recent Commits</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          Showing {commits?.length || 0} latest
        </span>
      </div>

      {!commits || commits.length === 0 ? (
        <div className="p-8 text-center text-xs text-zinc-500 font-mono">
          No commit activity recorded yet.
        </div>
      ) : (
        <div className="space-y-2 font-mono text-xs">
          {commits.map((item) => {
            const shortSha = item.sha.substring(0, 7);
            const dateStr = item.commit.author.date;
            const timeAgo = dateStr ? formatDistanceToNow(parseISO(dateStr), { addSuffix: true }) : '';
            const authorName = item.author?.login || item.commit.author.name;
            const avatarUrl = item.author?.avatar_url;

            return (
              <a
                key={item.sha}
                href={item.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all group min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={authorName}
                      className="w-6 h-6 rounded-full border border-zinc-800 shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold shrink-0">
                      {authorName.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <span className="text-zinc-200 font-medium truncate max-w-md group-hover:text-white transition-colors">
                    {item.commit.message.split('\n')[0]}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-400 font-mono">
                    {shortSha}
                  </span>
                  <span className="text-zinc-500 hidden sm:inline">{timeAgo}</span>
                  <HugeiconsIcon icon={Link01Icon} size={13} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RepositoryCommits;
