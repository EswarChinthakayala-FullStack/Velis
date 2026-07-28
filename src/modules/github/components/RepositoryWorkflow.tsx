import React from 'react';
import type { GitHubWorkflowRunItem } from '../types/github';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { CpuIcon, Tick02Icon, AlertCircleIcon, Link01Icon } from '@hugeicons/core-free-icons';

interface RepositoryWorkflowProps {
  workflows: GitHubWorkflowRunItem[] | undefined;
  isLoading?: boolean;
}

export const RepositoryWorkflow: React.FC<RepositoryWorkflowProps> = ({ workflows, isLoading }) => {
  if (isLoading) {
    return <div className="h-56 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />;
  }

  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={CpuIcon} size={15} className="text-zinc-400" />
          <span>GitHub Actions Workflows</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">{workflows?.length || 0} Runs</span>
      </div>

      {!workflows || workflows.length === 0 ? (
        <div className="p-6 text-center text-xs text-zinc-500 font-mono italic">
          No workflow runs detected for this repository.
        </div>
      ) : (
        <div className="space-y-2 font-mono text-xs">
          {workflows.map((run) => {
            const isSuccess = run.conclusion === 'success';
            const isFailure = run.conclusion === 'failure';

            return (
              <a
                key={run.id}
                href={run.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all group min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isSuccess ? (
                    <HugeiconsIcon icon={Tick02Icon} size={14} className="text-emerald-400 shrink-0" />
                  ) : isFailure ? (
                    <HugeiconsIcon icon={AlertCircleIcon} size={14} className="text-rose-400 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  )}

                  <div className="space-y-0.5 min-w-0">
                    <span className="text-zinc-200 font-medium truncate block group-hover:text-white transition-colors">
                      {run.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 block truncate">
                      Triggered by {run.actor?.login || 'event'} on {run.head_branch}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-[11px] text-zinc-500">
                  <span>{formatDistanceToNow(parseISO(run.created_at), { addSuffix: true })}</span>
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

export default RepositoryWorkflow;
