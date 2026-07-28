import type { GitHubRepoMetadata } from '../../types/github';

export type ConnectionStatusState = 'not_connected' | 'validating' | 'connected' | 'error';

export interface GitHubBranchItem {
  name: string;
  commitSha: string;
  protected: boolean;
}

export interface LinkGitHubRepoPayload {
  projectId: string;
  repoUrl: string;
  organization?: string;
  branch?: string;
  visibility?: 'public' | 'private';
  openIssues?: number;
  openPrs?: number;
}

export interface GitHubFormValues {
  repoUrl: string;
  organization: string;
  repoName: string;
  branch: string;
  visibility: 'public' | 'private';
}

export interface ValidateRepoResult {
  isValid: boolean;
  metadata: GitHubRepoMetadata | null;
  branches: GitHubBranchItem[];
  error?: string;
}
