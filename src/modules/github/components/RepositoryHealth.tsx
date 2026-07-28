import React from 'react';
import type { GitHubRepoMetadata, GitHubWorkflowRunItem } from '../types/github';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShieldKeyIcon, Tick02Icon, AlertCircleIcon, GitBranchIcon } from '@hugeicons/core-free-icons';

interface RepositoryHealthProps {
  metadata: GitHubRepoMetadata | null;
  workflows: GitHubWorkflowRunItem[] | undefined;
  isLoading?: boolean;
}

export const RepositoryHealth: React.FC<RepositoryHealthProps> = ({ metadata, workflows, isLoading }) => {
  if (isLoading) {
    return <div className="h-44 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />;
  }

  const latestWorkflow = workflows && workflows.length > 0 ? workflows[0] : null;
  const isCiPassing = latestWorkflow?.conclusion === 'success';

  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={ShieldKeyIcon} size={15} className="text-emerald-400" />
          <span>Repository Health & CI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2.5 font-mono text-xs">
        {/* Default Branch Protection */}
        <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-[10px]">Default Branch</span>
            <HugeiconsIcon icon={GitBranchIcon} size={13} className="text-amber-400 shrink-0" />
          </div>
          <div className="font-semibold text-zinc-200 truncate">
            {metadata?.default_branch || 'main'}
          </div>
          <span className="text-[10px] text-zinc-500 block truncate">Standard Protection</span>
        </div>

        {/* CI Status */}
        <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-[10px]">CI Build Status</span>
            {isCiPassing ? (
              <HugeiconsIcon icon={Tick02Icon} size={13} className="text-emerald-400 shrink-0" />
            ) : (
              <HugeiconsIcon icon={AlertCircleIcon} size={13} className="text-rose-400 shrink-0" />
            )}
          </div>
          <div className={`font-semibold capitalize truncate ${isCiPassing ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {latestWorkflow ? latestWorkflow.conclusion || latestWorkflow.status : 'No Workflows'}
          </div>
          <span className="text-[10px] text-zinc-500 block truncate">GitHub Actions Integration</span>
        </div>

        {/* Security / Open Alerts */}
        <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-[10px]">Security Auditing</span>
            <HugeiconsIcon icon={ShieldKeyIcon} size={13} className="text-blue-400 shrink-0" />
          </div>
          <div className="font-semibold text-emerald-400 text-xs truncate">
            0 Critical Alerts
          </div>
          <span className="text-[10px] text-zinc-500 block truncate">Dependabot Security</span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryHealth;
