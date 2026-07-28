import React from 'react';
import type { RepositoryStatsData } from '../hooks/useRepositoryStats';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  StarIcon,
  GitForkIcon,
  ViewIcon,
  AlertCircleIcon,
  GitPullRequestIcon,
  GitCommitIcon,
} from '@hugeicons/core-free-icons';

interface RepositoryStatsProps {
  stats: RepositoryStatsData | undefined;
  isLoading?: boolean;
}

export const RepositoryStats: React.FC<RepositoryStatsProps> = ({ stats, isLoading }) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
        ))}
      </div>
    );
  }

  const kpis = [
    { label: 'Stars', value: stats.stars, icon: StarIcon, color: 'text-amber-400' },
    { label: 'Forks', value: stats.forks, icon: GitForkIcon, color: 'text-zinc-300' },
    { label: 'Watchers', value: stats.watchers, icon: ViewIcon, color: 'text-blue-400' },
    { label: 'Open Issues', value: stats.openIssues, icon: AlertCircleIcon, color: 'text-rose-400' },
    { label: 'Pull Requests', value: stats.pullRequests, icon: GitPullRequestIcon, color: 'text-emerald-400' },
    { label: 'Recent Commits', value: stats.recentCommitsCount, icon: GitCommitIcon, color: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg backdrop-blur-xl space-y-1.5 transition-all hover:border-zinc-700/80 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-500 font-medium">{kpi.label}</span>
            <HugeiconsIcon icon={kpi.icon} size={15} className={`${kpi.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
          </div>
          <div className="text-xl font-bold text-white font-mono tracking-tight">
            {kpi.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RepositoryStats;
