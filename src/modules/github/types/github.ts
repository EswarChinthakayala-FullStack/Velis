/**
 * GitHub Integration Workspace Types (PHASE 08)
 * Strict TypeScript interfaces for live GitHub API endpoints & Supabase sync data.
 */

export interface GitHubRepoOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface GitHubLicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string | null;
}

export interface GitHubRepoMetadata {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubRepoOwner;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  topics: string[];
  license: GitHubLicense | null;
  subscribers_count?: number;
}

export interface GitHubCommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface GitHubCommitItem {
  sha: string;
  node_id: string;
  commit: {
    author: GitHubCommitAuthor;
    committer: GitHubCommitAuthor;
    message: string;
  };
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
}

export interface GitHubReleaseItem {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export interface GitHubIssueItem {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  user: {
    login: string;
    avatar_url: string;
  };
  labels: GitHubLabel[];
  created_at: string;
  updated_at: string;
  html_url: string;
  comments: number;
  pull_request?: Record<string, unknown>;
}

export interface GitHubPullRequestItem {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  user: {
    login: string;
    avatar_url: string;
  };
  head: {
    ref: string;
    label: string;
  };
  base: {
    ref: string;
    label: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
  draft?: boolean;
  mergeable?: boolean | null;
}

export type GitHubLanguageDistribution = Record<string, number>;

export interface GitHubWorkflowRunItem {
  id: number;
  name: string;
  head_branch: string;
  head_sha: string;
  status: string;
  conclusion: string | null;
  event: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  head_commit?: {
    message: string;
    author: {
      name: string;
    };
  };
  actor?: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubHealthStatus {
  isDefaultBranchProtected: boolean;
  ciStatus: 'passing' | 'failing' | 'unknown';
  openSecurityAlertsCount: number;
  lastWorkflowConclusion: string | null;
}

export interface GitHubSyncResult {
  success: boolean;
  lastSyncedAt: string;
  error?: string;
}
