import { supabase } from '../../../lib/supabase/client';
import { normalizeClientError } from '../../../lib/utils/client-errors';
import type {
  GitHubRepoMetadata,
  GitHubCommitItem,
  GitHubReleaseItem,
  GitHubIssueItem,
  GitHubPullRequestItem,
  GitHubLanguageDistribution,
  GitHubWorkflowRunItem,
  GitHubSyncResult,
} from '../types/github';

/**
 * Utility to parse owner and repository name from GitHub URL
 * Example: https://github.com/organization/repository -> { owner: "organization", repo: "repository" }
 */
export function parseGitHubUrl(url?: string): { owner: string; repo: string } | null {
  if (!url) return null;
  try {
    const cleaned = url.trim().replace(/\.git$/, '');
    const parsed = new URL(cleaned);
    if (!parsed.hostname.includes('github.com')) return null;

    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  } catch {
    // If not a full URL, try owner/repo format
    const parts = url.trim().split('/').filter(Boolean);
    if (parts.length === 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  }
}

/**
 * Fetch core repository metadata from GitHub REST API
 */
export async function fetchGitHubRepoMetadata(repoUrl?: string): Promise<GitHubRepoMetadata | null> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) throw new Error('GitHub repository not found or is private.');
      if (res.status === 403) throw new Error('GitHub API rate limit reached. Try again later.');
      throw new Error(`GitHub API error (${res.status})`);
    }

    return (await res.json()) as GitHubRepoMetadata;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch repository metadata.';
    console.warn('[GitHub API Warning]', message);
    throw new Error(message);
  }
}

/**
 * Fetch latest 10 commits from GitHub REST API
 */
export async function fetchGitHubCommits(repoUrl?: string): Promise<GitHubCommitItem[]> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=10`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );

    if (!res.ok) return [];
    return (await res.json()) as GitHubCommitItem[];
  } catch {
    return [];
  }
}

/**
 * Fetch releases from GitHub REST API
 */
export async function fetchGitHubReleases(repoUrl?: string): Promise<GitHubReleaseItem[]> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases?per_page=5`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );

    if (!res.ok) return [];
    return (await res.json()) as GitHubReleaseItem[];
  } catch {
    return [];
  }
}

/**
 * Fetch open issues (excluding PRs) from GitHub REST API
 */
export async function fetchGitHubIssues(repoUrl?: string): Promise<GitHubIssueItem[]> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues?state=open&per_page=10`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );

    if (!res.ok) return [];
    const data = (await res.json()) as GitHubIssueItem[];
    // Filter out pull requests which GitHub returns in the issues endpoint
    return data.filter((item) => !item.pull_request);
  } catch {
    return [];
  }
}

/**
 * Fetch open pull requests from GitHub REST API
 */
export async function fetchGitHubPullRequests(repoUrl?: string): Promise<GitHubPullRequestItem[]> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/pulls?state=open&per_page=10`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );

    if (!res.ok) return [];
    return (await res.json()) as GitHubPullRequestItem[];
  } catch {
    return [];
  }
}

/**
 * Fetch language byte breakdown from GitHub REST API
 */
export async function fetchGitHubLanguages(repoUrl?: string): Promise<GitHubLanguageDistribution> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return {};

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/languages`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );

    if (!res.ok) return {};
    return (await res.json()) as GitHubLanguageDistribution;
  } catch {
    return {};
  }
}

/**
 * Fetch repository topics from GitHub REST API
 */
export async function fetchGitHubTopics(repoUrl?: string): Promise<string[]> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return [];

  try {
    const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/topics`, {
      headers: { Accept: 'application/vnd.github.mercy-preview+json' },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.names || [];
  } catch {
    return [];
  }
}

/**
 * Fetch GitHub Actions workflow runs from GitHub REST API
 */
export async function fetchGitHubWorkflows(repoUrl?: string): Promise<GitHubWorkflowRunItem[]> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/actions/runs?per_page=5`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.workflow_runs || [];
  } catch {
    return [];
  }
}

/**
 * Trigger manual repository sync directly to Supabase using live GitHub API metadata
 */
export async function triggerGitHubSync(projectId: string, repoUrl: string): Promise<GitHubSyncResult> {
  const cleanUrl = repoUrl.trim();
  const parsed = parseGitHubUrl(cleanUrl);
  if (!parsed || !projectId) {
    return {
      success: false,
      lastSyncedAt: new Date().toISOString(),
      error: 'Invalid project or GitHub repository URL.',
    };
  }

  try {
    // 1. Fetch live repository metadata from GitHub REST API
    const meta = await fetchGitHubRepoMetadata(cleanUrl);

    // 2. Upsert into Supabase github_repositories table directly
    const { data: existing } = await (supabase as any)
      .from('github_repositories')
      .select('id')
      .eq('project_id', projectId)
      .maybeSingle();

    const record = {
      project_id: projectId,
      repo_url: cleanUrl,
      organization: meta?.owner.login || parsed.owner,
      branch: meta?.default_branch || 'main',
      visibility: meta?.private ? 'private' : 'public',
      open_issues: meta?.open_issues_count || 0,
      last_synced_at: new Date().toISOString(),
    };

    if (existing) {
      const { error } = await (supabase as any)
        .from('github_repositories')
        .update(record)
        .eq('id', existing.id);

      if (error) {
        const normalized = normalizeClientError(error);
        throw new Error(normalized.message);
      }
    } else {
      const { error } = await (supabase as any)
        .from('github_repositories')
        .insert(record);

      if (error) {
        const normalized = normalizeClientError(error);
        throw new Error(normalized.message);
      }
    }

    return {
      success: true,
      lastSyncedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Repository synchronization failed.';
    return {
      success: false,
      lastSyncedAt: new Date().toISOString(),
      error: message,
    };
  }
}
