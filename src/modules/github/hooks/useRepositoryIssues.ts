import { useQuery } from '@tanstack/react-query';
import { fetchGitHubIssues } from '../lib/api';
import type { GitHubIssueItem } from '../types/github';

export function useRepositoryIssues(repoUrl?: string) {
  return useQuery<GitHubIssueItem[], Error>({
    queryKey: ['github-repo-issues', repoUrl],
    queryFn: () => fetchGitHubIssues(repoUrl),
    enabled: Boolean(repoUrl),
    staleTime: 1000 * 60 * 3,
  });
}
