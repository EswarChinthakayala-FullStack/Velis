import { useQuery } from '@tanstack/react-query';
import { fetchGitHubReleases } from '../lib/api';
import type { GitHubReleaseItem } from '../types/github';

export function useRepositoryReleases(repoUrl?: string) {
  return useQuery<GitHubReleaseItem[], Error>({
    queryKey: ['github-repo-releases', repoUrl],
    queryFn: () => fetchGitHubReleases(repoUrl),
    enabled: Boolean(repoUrl),
    staleTime: 1000 * 60 * 10,
  });
}
