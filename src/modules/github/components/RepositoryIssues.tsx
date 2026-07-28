import React from 'react';
import type { GitHubIssueItem } from '../types/github';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon, Link01Icon } from '@hugeicons/core-free-icons';

interface RepositoryIssuesProps {
  issues: GitHubIssueItem[] | undefined;
  isLoading?: boolean;
}

export const RepositoryIssues: React.FC<RepositoryIssuesProps> = ({ issues, isLoading }) => {
  if (isLoading) {
    return <div className="h-56 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />;
  }

  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={AlertCircleIcon} size={15} className="text-rose-400" />
          <span>Open Issues</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">{issues?.length || 0} Open</span>
      </div>

      {!issues || issues.length === 0 ? (
        <div className="p-6 text-center text-xs text-zinc-500 font-mono italic">
          No open issues reported.
        </div>
      ) : (
        <div className="space-y-2 font-mono text-xs">
          {issues.map((issue) => (
            <a
              key={issue.id}
              href={issue.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all group min-w-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-rose-400 font-bold">#{issue.number}</span>
                <span className="text-zinc-200 font-medium truncate group-hover:text-white transition-colors">
                  {issue.title}
                </span>

                {issue.labels.map((label) => (
                  <span
                    key={label.id}
                    className="px-1.5 py-0.5 rounded text-[10px] hidden md:inline shrink-0"
                    style={{
                      backgroundColor: `#${label.color}22`,
                      color: `#${label.color}`,
                      border: `1px solid #${label.color}44`,
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0 text-[11px] text-zinc-500">
                <span>{formatDistanceToNow(parseISO(issue.created_at), { addSuffix: true })}</span>
                <HugeiconsIcon icon={Link01Icon} size={13} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepositoryIssues;
