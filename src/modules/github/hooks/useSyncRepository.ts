import { useMutation, useQueryClient } from '@tanstack/react-query';
import { triggerGitHubSync } from '../lib/api';
import type { GitHubSyncResult } from '../types/github';

export function useSyncRepository() {
  const queryClient = useQueryClient();

  return useMutation<GitHubSyncResult, Error, { projectId: string; repoUrl: string }>({
    mutationFn: ({ projectId, repoUrl }) => triggerGitHubSync(projectId, repoUrl),
    onSuccess: (_, variables) => {
      // Invalidate all GitHub and project detail queries
      queryClient.invalidateQueries({ queryKey: ['github-repo', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['github-repo-stats', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['github-repo-commits', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['github-repo-releases', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['github-repo-issues', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['github-repo-prs', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['github-repo-languages', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['github-repo-topics', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['github-repo-workflows', variables.repoUrl] });
      queryClient.invalidateQueries({ queryKey: ['project-details', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
