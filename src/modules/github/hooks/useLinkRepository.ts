import { useMutation, useQueryClient } from '@tanstack/react-query';
import { linkProjectGitHubRepo } from '../../../lib/supabase/queries/github';
import type { LinkGitHubRepoPayload } from '../lib/github/types';

export function useLinkRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LinkGitHubRepoPayload) => {
      return await linkProjectGitHubRepo(payload.projectId, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-github-connection', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['github-repo', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['project-detail', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-details', variables.projectId] });
    },
  });
}

export default useLinkRepository;
