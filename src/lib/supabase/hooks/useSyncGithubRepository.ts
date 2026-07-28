import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncGithubRepository } from '../queries/github';
import type { GitHubSyncResult, GitHubSyncPayload } from '../types/github';

export function useSyncGithubRepository(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<GitHubSyncResult, Error, GitHubSyncPayload | { projectId: string; repoUrl?: string }>({
    mutationFn: async (payload) => {
      const targetProjectId = payload.projectId || projectId || '';
      return await syncGithubRepository({
        projectId: targetProjectId,
        repoUrl: payload.repoUrl,
      });
    },
    onSuccess: (result, variables) => {
      const targetProjectId = variables.projectId || projectId;

      if (targetProjectId) {
        queryClient.invalidateQueries({ queryKey: ['github-repository', targetProjectId] });
        queryClient.invalidateQueries({ queryKey: ['project-github-connection', targetProjectId] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['project-detail', targetProjectId] });
      }
    },
  });
}

export default useSyncGithubRepository;
