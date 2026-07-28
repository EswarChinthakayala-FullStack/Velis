export interface GitHubRepositoryData {
  id: string;
  projectId: string;
  repoUrl: string;
  organization?: string;
  branch: string;
  visibility: 'public' | 'private';
  openIssues: number;
  openPrs: number;
  lastSyncedAt?: string;
  updatedAt?: string;
}

export interface GitHubSyncPayload {
  projectId: string;
  repoUrl?: string;
}

export interface GitHubSyncResult {
  success: boolean;
  lastSyncedAt: string;
  error?: string;
  repository?: {
    full_name: string;
    default_branch: string;
    visibility: string;
    open_issues: number;
    open_prs: number;
    language?: string | null;
    stars?: number;
    forks?: number;
    latest_release?: string | null;
    languages?: Record<string, number>;
    topics?: string[];
  };
}
