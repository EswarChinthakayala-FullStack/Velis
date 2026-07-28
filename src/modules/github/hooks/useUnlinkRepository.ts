import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unlinkProjectGitHubRepo } from '../../../lib/supabase/queries/github';

export function useUnlinkRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      return await unlinkProjectGitHubRepo(projectId);
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['project-github-connection', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-detail', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-details', projectId] });
    },
  });
}

export default useUnlinkRepository;
