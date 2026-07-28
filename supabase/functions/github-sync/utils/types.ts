export interface SyncPayload {
  project_id?: string;
  projectId?: string;
  repoUrl?: string;
  repo_url?: string;
}

export interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  private: boolean;
  default_branch: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics?: string[];
}

export interface GitHubReleaseResponse {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  html_url: string;
}

export interface GitHubBranchInfo {
  name: string;
  protected: boolean;
}

export interface GitHubSyncResult {
  success: boolean;
  last_synced_at: string;
  repository?: {
    full_name: string;
    default_branch: string;
    visibility: string;
    open_issues: number;
    open_prs: number;
  };
}
