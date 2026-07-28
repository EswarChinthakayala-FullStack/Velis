import { useQuery } from '@tanstack/react-query';
import { fetchGithubRepository } from '../queries/github';
import type { GitHubRepositoryData } from '../types/github';

export function useGithubRepository(projectId?: string) {
  return useQuery<GitHubRepositoryData | null>({
    queryKey: ['github-repository', projectId],
    queryFn: async (): Promise<GitHubRepositoryData | null> => {
      if (!projectId) return null;
      return await fetchGithubRepository(projectId);
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 15,    // 15 minutes garbage collection
    retry: 1,
  });
}

export default useGithubRepository;
