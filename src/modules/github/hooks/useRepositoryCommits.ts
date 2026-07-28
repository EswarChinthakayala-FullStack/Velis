import { useQuery } from '@tanstack/react-query';
import { fetchGitHubCommits } from '../lib/api';
import type { GitHubCommitItem } from '../types/github';

export function useRepositoryCommits(repoUrl?: string) {
  return useQuery<GitHubCommitItem[], Error>({
    queryKey: ['github-repo-commits', repoUrl],
    queryFn: () => fetchGitHubCommits(repoUrl),
    enabled: Boolean(repoUrl),
    staleTime: 1000 * 60 * 3,
  });
}
