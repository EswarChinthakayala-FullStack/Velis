import { useQuery } from '@tanstack/react-query';
import { getProjectGitHubRepo } from '../../../lib/supabase/queries/github';

export function useRepositoryConnection(projectId?: string) {
  return useQuery({
    queryKey: ['project-github-connection', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      return await getProjectGitHubRepo(projectId);
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export default useRepositoryConnection;
