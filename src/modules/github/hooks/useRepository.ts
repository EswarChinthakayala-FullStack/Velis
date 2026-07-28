import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepoMetadata } from '../lib/api';
import type { GitHubRepoMetadata } from '../types/github';

export function useRepository(repoUrl?: string) {
  return useQuery<GitHubRepoMetadata | null, Error>({
    queryKey: ['github-repo', repoUrl],
    queryFn: () => fetchGitHubRepoMetadata(repoUrl),
    enabled: Boolean(repoUrl),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
