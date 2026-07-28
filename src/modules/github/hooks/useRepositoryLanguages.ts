import { useQuery } from '@tanstack/react-query';
import { fetchGitHubLanguages } from '../lib/api';
import type { GitHubLanguageDistribution } from '../types/github';

export function useRepositoryLanguages(repoUrl?: string) {
  return useQuery<GitHubLanguageDistribution, Error>({
    queryKey: ['github-repo-languages', repoUrl],
    queryFn: () => fetchGitHubLanguages(repoUrl),
    enabled: Boolean(repoUrl),
    staleTime: 1000 * 60 * 10,
  });
}
