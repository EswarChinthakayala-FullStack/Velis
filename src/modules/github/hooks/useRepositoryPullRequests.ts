import { useQuery } from '@tanstack/react-query';
import { fetchGitHubPullRequests } from '../lib/api';
import type { GitHubPullRequestItem } from '../types/github';

export function useRepositoryPullRequests(repoUrl?: string) {
  return useQuery<GitHubPullRequestItem[], Error>({
    queryKey: ['github-repo-prs', repoUrl],
    queryFn: () => fetchGitHubPullRequests(repoUrl),
    enabled: Boolean(repoUrl),
    staleTime: 1000 * 60 * 3,
  });
}
