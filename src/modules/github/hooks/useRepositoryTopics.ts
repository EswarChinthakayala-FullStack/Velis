import { useQuery } from '@tanstack/react-query';
import { fetchGitHubTopics } from '../lib/api';

export function useRepositoryTopics(repoUrl?: string) {
  return useQuery<string[], Error>({
    queryKey: ['github-repo-topics', repoUrl],
    queryFn: () => fetchGitHubTopics(repoUrl),
    enabled: Boolean(repoUrl),
    staleTime: 1000 * 60 * 10,
  });
}
