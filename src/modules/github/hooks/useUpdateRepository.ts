import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProjectGitHubRepo } from '../../../lib/supabase/queries/github';
import type { LinkGitHubRepoPayload } from '../lib/github/types';

export function useUpdateRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      updates,
    }: {
      projectId: string;
      updates: Partial<LinkGitHubRepoPayload>;
    }) => {
      return await updateProjectGitHubRepo(projectId, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-github-connection', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-detail', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-details', variables.projectId] });
    },
  });
}

export default useUpdateRepository;
