import React from 'react';
import type { GitHubPullRequestItem } from '../types/github';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitPullRequestIcon, Link01Icon } from '@hugeicons/core-free-icons';

interface RepositoryPullRequestsProps {
  pullRequests: GitHubPullRequestItem[] | undefined;
  isLoading?: boolean;
}

export const RepositoryPullRequests: React.FC<RepositoryPullRequestsProps> = ({ pullRequests, isLoading }) => {
  if (isLoading) {
    return <div className="h-56 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />;
  }

  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={GitPullRequestIcon} size={15} className="text-emerald-400" />
          <span>Pull Requests</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">{pullRequests?.length || 0} Open</span>
      </div>

      {!pullRequests || pullRequests.length === 0 ? (
        <div className="p-6 text-center text-xs text-zinc-500 font-mono italic">
          No open pull requests.
        </div>
      ) : (
        <div className="space-y-2 font-mono text-xs">
          {pullRequests.map((pr) => (
            <a
              key={pr.id}
              href={pr.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all group min-w-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-emerald-400 font-bold">#{pr.number}</span>
                <span className="text-zinc-200 font-medium truncate group-hover:text-white transition-colors">
                  {pr.title}
                </span>

                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 hidden sm:inline shrink-0">
                  {pr.head.ref} → {pr.base.ref}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-[11px] text-zinc-500">
                <span>{formatDistanceToNow(parseISO(pr.created_at), { addSuffix: true })}</span>
                <HugeiconsIcon icon={Link01Icon} size={13} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepositoryPullRequests;
