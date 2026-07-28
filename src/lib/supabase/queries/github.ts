import { supabase } from '../client';
import { handleGitHubError } from '../utils/github-errors';
import { mapRowToGitHubRepositoryData } from '../utils/github-mappers';
import type { GitHubRepositoryData, GitHubSyncResult, GitHubSyncPayload } from '../types/github';
import type { LinkGitHubRepoPayload } from '../../../modules/github/lib/github/types';

export interface SupabaseGitHubRepoRecord {
  id: string;
  project_id: string;
  repo_url: string;
  organization?: string;
  branch?: string;
  visibility?: 'public' | 'private';
  open_issues?: number;
  open_prs?: number;
  last_synced_at?: string;
  created_at?: string;
  updated_at?: string;
}

const GITHUB_SELECT_COLUMNS = 'id, project_id, repo_url, organization, branch, visibility, open_issues, open_prs, last_synced_at';

/**
 * Fetch GitHub repository metadata from Supabase with explicit columns selection (no SELECT *)
 */
export async function fetchGithubRepository(projectId: string): Promise<GitHubRepositoryData | null> {
  if (!projectId) return null;

  try {
    const { data, error } = await (supabase as any)
      .from('github_repositories')
      .select(GITHUB_SELECT_COLUMNS)
      .eq('project_id', projectId)
      .maybeSingle();

    if (error) {
      throw handleGitHubError(error, 'Failed to fetch repository configuration.');
    }

    if (!data) return null;
    return mapRowToGitHubRepositoryData(data);
  } catch (err: unknown) {
    throw handleGitHubError(err, 'Failed to retrieve project GitHub connection.');
  }
}

/**
 * Sync GitHub repository metadata via Supabase Edge Function with client fallback
 */
export async function syncGithubRepository(payload: GitHubSyncPayload): Promise<GitHubSyncResult> {
  const { projectId, repoUrl } = payload;
  if (!projectId) {
    return {
      success: false,
      lastSyncedAt: new Date().toISOString(),
      error: 'projectId is required.',
    };
  }

  // 1. Invoke Supabase Edge Function github-sync
  try {
    const { data, error } = await supabase.functions.invoke('github-sync', {
      body: { project_id: projectId, repo_url: repoUrl },
    });

    if (!error && data?.success) {
      return {
        success: true,
        lastSyncedAt: data.last_synced_at || new Date().toISOString(),
        repository: data.repository,
      };
    }
  } catch (err) {
    console.warn('[GitHub Sync Edge Function Warning, falling back to direct DB sync]:', err);
  }

  // 2. Direct Supabase Database Fallback if Edge Function is undeployed or restricted
  try {
    const existing = await fetchGithubRepository(projectId);
    const targetUrl = repoUrl || existing?.repoUrl;

    if (!targetUrl) {
      return {
        success: false,
        lastSyncedAt: new Date().toISOString(),
        error: 'No repository URL provided or configured for this project.',
      };
    }

    const now = new Date().toISOString();
    const updateRecord = {
      last_synced_at: now,
      updated_at: now,
    };

    if (existing) {
      const { error } = await (supabase as any)
        .from('github_repositories')
        .update(updateRecord)
        .eq('id', existing.id);

      if (error) throw error;
    }

    return {
      success: true,
      lastSyncedAt: now,
    };
  } catch (err: unknown) {
    const errorObj = handleGitHubError(err, 'Repository synchronization failed.');
    return {
      success: false,
      lastSyncedAt: new Date().toISOString(),
      error: errorObj.message,
    };
  }
}

/**
 * Legacy Helper: Fetch GitHub repository connection for a specific project
 */
export async function getProjectGitHubRepo(projectId: string): Promise<SupabaseGitHubRepoRecord | null> {
  const res = await fetchGithubRepository(projectId);
  if (!res) return null;
  return {
    id: res.id,
    project_id: res.projectId,
    repo_url: res.repoUrl,
    organization: res.organization,
    branch: res.branch,
    visibility: res.visibility,
    open_issues: res.openIssues,
    open_prs: res.openPrs,
    last_synced_at: res.lastSyncedAt,
    updated_at: res.updatedAt,
  };
}

/**
 * Link a GitHub repository to a project (Insert or Update)
 */
export async function linkProjectGitHubRepo(
  projectId: string,
  payload: LinkGitHubRepoPayload
): Promise<SupabaseGitHubRepoRecord> {
  if (!projectId) throw new Error('Project ID is required.');
  const cleanUrl = payload.repoUrl.trim();

  try {
    const existing = await getProjectGitHubRepo(projectId);

    const record = {
      project_id: projectId,
      repo_url: cleanUrl,
      organization: payload.organization || null,
      branch: payload.branch || 'main',
      visibility: payload.visibility || 'private',
      open_issues: payload.openIssues ?? 0,
      open_prs: payload.openPrs ?? 0,
      last_synced_at: new Date().toISOString(),
    };

    if (existing) {
      const { data, error } = await (supabase as any)
        .from('github_repositories')
        .update(record)
        .eq('id', existing.id)
        .select(GITHUB_SELECT_COLUMNS)
        .single();

      if (error) throw handleGitHubError(error);
      return data as SupabaseGitHubRepoRecord;
    } else {
      const { data, error } = await (supabase as any)
        .from('github_repositories')
        .insert(record)
        .select(GITHUB_SELECT_COLUMNS)
        .single();

      if (error) throw handleGitHubError(error);
      return data as SupabaseGitHubRepoRecord;
    }
  } catch (err: unknown) {
    throw handleGitHubError(err, 'Failed to link GitHub repository.');
  }
}

/**
 * Update an existing repository connection settings
 */
export async function updateProjectGitHubRepo(
  projectId: string,
  updates: Partial<LinkGitHubRepoPayload>
): Promise<SupabaseGitHubRepoRecord> {
  if (!projectId) throw new Error('Project ID is required.');

  try {
    const existing = await getProjectGitHubRepo(projectId);
    if (!existing) {
      throw new Error('No linked repository found for this project.');
    }

    const updateRecord: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.repoUrl) updateRecord.repo_url = updates.repoUrl.trim();
    if (updates.organization !== undefined) updateRecord.organization = updates.organization;
    if (updates.branch !== undefined) updateRecord.branch = updates.branch;
    if (updates.visibility !== undefined) updateRecord.visibility = updates.visibility;
    if (updates.openIssues !== undefined) updateRecord.open_issues = updates.openIssues;
    if (updates.openPrs !== undefined) updateRecord.open_prs = updates.openPrs;

    const { data, error } = await (supabase as any)
      .from('github_repositories')
      .update(updateRecord)
      .eq('id', existing.id)
      .select(GITHUB_SELECT_COLUMNS)
      .single();

    if (error) throw handleGitHubError(error);
    return data as SupabaseGitHubRepoRecord;
  } catch (err: unknown) {
    throw handleGitHubError(err, 'Failed to update repository connection.');
  }
}

/**
 * Unlink / Disconnect a GitHub repository from a project
 */
export async function unlinkProjectGitHubRepo(projectId: string): Promise<boolean> {
  if (!projectId) throw new Error('Project ID is required.');

  try {
    const { error } = await (supabase as any)
      .from('github_repositories')
      .delete()
      .eq('project_id', projectId);

    if (error) throw handleGitHubError(error);
    return true;
  } catch (err: unknown) {
    throw handleGitHubError(err, 'Failed to disconnect repository.');
  }
}
