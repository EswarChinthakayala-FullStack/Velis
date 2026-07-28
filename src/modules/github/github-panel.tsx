import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRepository } from './hooks/useRepository';
import { useRepositoryStats } from './hooks/useRepositoryStats';
import { useRepositoryCommits } from './hooks/useRepositoryCommits';
import { useRepositoryReleases } from './hooks/useRepositoryReleases';
import { useRepositoryIssues } from './hooks/useRepositoryIssues';
import { useRepositoryPullRequests } from './hooks/useRepositoryPullRequests';
import { useRepositoryLanguages } from './hooks/useRepositoryLanguages';
import { useRepositoryTopics } from './hooks/useRepositoryTopics';
import { useRepositoryWorkflow } from './hooks/useRepositoryWorkflow';
import { useSyncRepository } from './hooks/useSyncRepository';
import { useRepositoryConnection } from './hooks/useRepositoryConnection';

import { RepositoryHeader } from './components/RepositoryHeader';
import { RepositoryInfoCard } from './components/RepositoryInfoCard';
import { RepositoryStats } from './components/RepositoryStats';
import { RepositoryLanguages } from './components/RepositoryLanguages';
import { RepositoryTopics } from './components/RepositoryTopics';
import { RepositoryCommits } from './components/RepositoryCommits';
import { RepositoryReleases } from './components/RepositoryReleases';
import { RepositoryIssues } from './components/RepositoryIssues';
import { RepositoryPullRequests } from './components/RepositoryPullRequests';
import { RepositoryHealth } from './components/RepositoryHealth';
import { RepositoryWorkflow } from './components/RepositoryWorkflow';
import { RepositorySyncButton } from './components/RepositorySyncButton';
import { RepositoryEmptyState } from './components/RepositoryEmptyState';
import { RepositorySkeleton } from './components/RepositorySkeleton';

interface GitHubPanelProps {
  projectId?: string;
  githubRepoUrl?: string;
  lastSyncedAt?: string | null;
  onConnectRepo?: () => void;
}

/**
 * Enterprise GitHub Integration Workspace (PHASE 08)
 * Real-time repository dashboard displaying live commits, releases, issues,
 * PRs, language breakdown, workflow runs, and Supabase synchronization.
 * Backed 100% by live GitHub REST API & Supabase Edge Functions.
 * Strictly production-only: ZERO mock or dummy data.
 */
export const GitHubPanel: React.FC<GitHubPanelProps> = ({
  projectId,
  githubRepoUrl,
  lastSyncedAt,
  onConnectRepo,
}) => {
  const { data: repoConnection, isLoading: isConnectionLoading } = useRepositoryConnection(projectId);
  const effectiveRepoUrl = githubRepoUrl || repoConnection?.repo_url;

  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(lastSyncedAt || null);

  React.useEffect(() => {
    if (lastSyncedAt || repoConnection?.last_synced_at) {
      setLastSyncedTime(lastSyncedAt || repoConnection?.last_synced_at || null);
    }
  }, [lastSyncedAt, repoConnection]);

  // React Query Hooks per section
  const { data: repoMetadata, isLoading: isRepoLoading, isError: isRepoError, error: repoError } = useRepository(effectiveRepoUrl);
  const { data: stats, isLoading: isStatsLoading } = useRepositoryStats(effectiveRepoUrl);
  const { data: commits, isLoading: isCommitsLoading } = useRepositoryCommits(effectiveRepoUrl);
  const { data: releases, isLoading: isReleasesLoading } = useRepositoryReleases(effectiveRepoUrl);
  const { data: issues, isLoading: isIssuesLoading } = useRepositoryIssues(effectiveRepoUrl);
  const { data: pullRequests, isLoading: isPrsLoading } = useRepositoryPullRequests(effectiveRepoUrl);
  const { data: languages, isLoading: isLanguagesLoading } = useRepositoryLanguages(effectiveRepoUrl);
  const { data: topics, isLoading: isTopicsLoading } = useRepositoryTopics(effectiveRepoUrl);
  const { data: workflows, isLoading: isWorkflowsLoading } = useRepositoryWorkflow(effectiveRepoUrl);

  const syncMutation = useSyncRepository();

  const handleSyncNow = async () => {
    if (!projectId || !effectiveRepoUrl) return;
    setSyncError(null);

    try {
      const res = await syncMutation.mutateAsync({ projectId, repoUrl: effectiveRepoUrl });
      if (res.success && res.lastSyncedAt) {
        setLastSyncedTime(res.lastSyncedAt);
      } else if (res.error) {
        setSyncError(res.error);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Synchronization failed.';
      setSyncError(message);
    }
  };

  // If connection query is loading
  if (isConnectionLoading) {
    return <RepositorySkeleton />;
  }

  // If no repository URL attached
  if (!effectiveRepoUrl) {
    return <RepositoryEmptyState onConnectRepo={onConnectRepo} />;
  }

  // If fetching metadata resulted in error
  if (isRepoError) {
    return (
      <div className="p-8 text-center border border-zinc-800/80 rounded-xl bg-[rgba(17,17,19,0.85)] space-y-3 max-w-md mx-auto my-8 font-mono">
        <h4 className="text-sm font-bold text-white">Repository unavailable</h4>
        <p className="text-xs text-rose-400">
          {repoError?.message || 'Could not fetch repository information from GitHub.'}
        </p>
      </div>
    );
  }

  // If initial load
  if (isRepoLoading && !repoMetadata) {
    return <RepositorySkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="space-y-5 text-zinc-100 select-none"
    >
      {/* 1. Sync Banner / Error Alert */}
      {syncError && (
        <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-mono flex items-center justify-between">
          <span>{syncError}</span>
          <button
            type="button"
            onClick={() => setSyncError(null)}
            className="text-rose-400 hover:text-white cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Repository Header */}
      <RepositoryHeader metadata={repoMetadata || null} isLoading={isRepoLoading} />

      {/* 3. KPI Statistics Cards */}
      <RepositoryStats stats={stats} isLoading={isStatsLoading} />

      {/* 4. Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols Desktop) */}
        <div className="lg:col-span-2 space-y-5 min-w-0">
          {/* Recent Commits */}
          <RepositoryCommits commits={commits} isLoading={isCommitsLoading} />

          {/* Open Issues & Pull Requests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RepositoryIssues issues={issues} isLoading={isIssuesLoading} />
            <RepositoryPullRequests pullRequests={pullRequests} isLoading={isPrsLoading} />
          </div>

          {/* Workflows */}
          <RepositoryWorkflow workflows={workflows} isLoading={isWorkflowsLoading} />
        </div>

        {/* Right Column (1 Col Desktop) */}
        <div className="space-y-5 min-w-0">
          {/* Latest Release */}
          <RepositoryReleases releases={releases} isLoading={isReleasesLoading} />

          {/* Repository Information */}
          <RepositoryInfoCard metadata={repoMetadata || null} isLoading={isRepoLoading} />

          {/* Languages Breakdown */}
          <RepositoryLanguages languages={languages} isLoading={isLanguagesLoading} />

          {/* Topics */}
          <RepositoryTopics topics={topics} isLoading={isTopicsLoading} />

          {/* Repository Health */}
          <RepositoryHealth metadata={repoMetadata || null} workflows={workflows} isLoading={isWorkflowsLoading} />

          {/* Manual Sync Trigger */}
          <RepositorySyncButton
            lastSyncedAt={lastSyncedTime}
            isSyncing={syncMutation.isPending}
            onSync={handleSyncNow}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubPanel;
