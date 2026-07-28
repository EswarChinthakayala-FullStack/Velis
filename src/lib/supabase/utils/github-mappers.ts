import type { GitHubRepositoryData } from '../types/github';

export function mapRowToGitHubRepositoryData(row: any): GitHubRepositoryData {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    repoUrl: String(row.repo_url),
    organization: row.organization ? String(row.organization) : undefined,
    branch: String(row.branch || 'main'),
    visibility: row.visibility === 'public' ? 'public' : 'private',
    openIssues: Number(row.open_issues || 0),
    openPrs: Number(row.open_prs || 0),
    lastSyncedAt: row.last_synced_at ? String(row.last_synced_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}
