import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepoMetadata, fetchGitHubCommits, fetchGitHubIssues, fetchGitHubPullRequests } from '../lib/api';

export interface RepositoryStatsData {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  pullRequests: number;
  recentCommitsCount: number;
  defaultBranch: string;
}

export function useRepositoryStats(repoUrl?: string) {
  return useQuery<RepositoryStatsData, Error>({
    queryKey: ['github-repo-stats', repoUrl],
    queryFn: async () => {
      if (!repoUrl) {
        return { stars: 0, forks: 0, watchers: 0, openIssues: 0, pullRequests: 0, recentCommitsCount: 0, defaultBranch: 'main' };
      }

      const [metadata, commits, issues, prs] = await Promise.all([
        fetchGitHubRepoMetadata(repoUrl),
        fetchGitHubCommits(repoUrl),
        fetchGitHubIssues(repoUrl),
        fetchGitHubPullRequests(repoUrl),
      ]);

      return {
        stars: metadata?.stargazers_count || 0,
        forks: metadata?.forks_count || 0,
        watchers: metadata?.subscribers_count || metadata?.watchers_count || 0,
        openIssues: issues.length || metadata?.open_issues_count || 0,
        pullRequests: prs.length || 0,
        recentCommitsCount: commits.length || 0,
        defaultBranch: metadata?.default_branch || 'main',
      };
    },
    enabled: Boolean(repoUrl),
    staleTime: 1000 * 60 * 5,
  });
}
