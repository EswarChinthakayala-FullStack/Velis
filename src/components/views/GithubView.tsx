import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  GitBranchIcon,
  GitPullRequestIcon,
  StarIcon,
  SourceCodeIcon,
  CheckmarkCircle01Icon
} from '@hugeicons/core-free-icons';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import type { GitHubRepo, Commit, PullRequest } from '../../types';

interface GithubViewProps {
  repos: GitHubRepo[];
  commits: Commit[];
  pullRequests: PullRequest[];
}

export const GithubView: React.FC<GithubViewProps> = ({
  repos,
  commits,
  pullRequests
}) => {
  const [selectedRepo, setSelectedRepo] = useState<string>(repos[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'pull_requests' | 'commits' | 'diff'>('pull_requests');

  const currentRepo = repos.find((r) => r.id === selectedRepo) || repos[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            GitHub Developer Hub
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Real-time repository sync, pull request reviews, and commit trajectory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GlassBadge variant="zinc" size="md">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-zinc-300 mr-1.5 inline" />
            GitHub App Connected (velis-bot v2.4)
          </GlassBadge>
        </div>
      </div>

      {/* Repos Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {repos.map((repo) => {
          const isSelected = repo.id === selectedRepo;
          return (
            <GlassCard
              key={repo.id}
              hoverEffect
              onClick={() => setSelectedRepo(repo.id)}
              className={`cursor-pointer transition-all ${
                isSelected ? 'border-white/30 bg-zinc-800/60 ring-1 ring-white/10' : ''
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">
                    {repo.language}
                  </span>
                  <GlassBadge variant="zinc" size="sm">
                    {repo.defaultBranch}
                  </GlassBadge>
                </div>
                <h3 className="text-sm font-bold text-white truncate">
                  {repo.name.split('/')[1]}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-snug">
                  {repo.description}
                </p>
                <div className="flex items-center gap-4 pt-2 text-[11px] text-zinc-400 font-mono">
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={StarIcon} size={12} className="text-zinc-400" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={GitPullRequestIcon} size={12} className="text-zinc-400" />
                    <span>{repo.openPRs} PRs</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Selected Repo Inspector Panel */}
      {currentRepo && (
        <GlassCard hoverEffect={false} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/80 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white">
                <HugeiconsIcon icon={SourceCodeIcon} size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">
                  {currentRepo.name}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Updated {currentRepo.updatedAt} • {currentRepo.commitsCount} total commits
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/60">
              <button
                onClick={() => setActiveTab('pull_requests')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'pull_requests'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Pull Requests ({pullRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('commits')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'commits'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Commit Feed
              </button>
              <button
                onClick={() => setActiveTab('diff')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'diff'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Diff Inspector
              </button>
            </div>
          </div>

          {/* Tab 1: Pull Requests */}
          {activeTab === 'pull_requests' && (
            <div className="space-y-3">
              {pullRequests.map((pr) => (
                <div
                  key={pr.id}
                  className="p-4 rounded-[16px] bg-zinc-900/60 border border-zinc-800/70 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={GitPullRequestIcon} size={16} className="text-zinc-300" />
                      <h4 className="text-sm font-semibold text-white">
                        {pr.title}
                      </h4>
                      <GlassBadge variant="zinc" size="sm">
                        #{pr.id}
                      </GlassBadge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                      <span>by {pr.author}</span>
                      <span>•</span>
                      <span>branch: {pr.branch}</span>
                      <span>•</span>
                      <span>{pr.commentsCount} comments</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-zinc-300">+{pr.additions}</span>
                    <span className="text-zinc-500">-{pr.deletions}</span>
                    <GlassButton variant="secondary" size="sm">
                      Review PR
                    </GlassButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Commit Feed */}
          {activeTab === 'commits' && (
            <div className="space-y-3">
              {commits.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-[16px] bg-zinc-900/60 border border-zinc-800/70 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={c.avatar}
                      alt={c.author}
                      className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {c.message}
                      </p>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {c.author} committed {c.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-mono text-xs text-zinc-400">
                    <span className="bg-zinc-800 px-2 py-1 rounded border border-zinc-700/50">
                      {c.hash}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Code Diff Inspector */}
          {activeTab === 'diff' && (
            <div className="rounded-[18px] bg-zinc-950 border border-zinc-800/80 p-4 font-mono text-xs overflow-x-auto space-y-1">
              <div className="text-zinc-500 pb-2 border-b border-zinc-800 mb-2">
                diff --git a/src/components/layout/AppLayout.tsx b/src/components/layout/AppLayout.tsx
              </div>
              <div className="text-zinc-400">@@ -14,6 +14,8 @@ export const AppLayout = () {'{'}</div>
              <div className="text-zinc-300 font-medium"> const [isCollapsed, setIsCollapsed] = useState(false);</div>
              <div className="text-zinc-200 bg-zinc-800/50 px-1 py-0.5 rounded">
                + const [isLiquidGlassEnabled, setIsLiquidGlassEnabled] = useState(true);
              </div>
              <div className="text-zinc-200 bg-zinc-800/50 px-1 py-0.5 rounded">
                + // Enforce monochrome zinc design system tokens
              </div>
              <div className="text-zinc-500"> return (</div>
              <div className="text-zinc-400"> &lt;div className="min-h-screen bg-[#050505]"&gt;</div>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};
