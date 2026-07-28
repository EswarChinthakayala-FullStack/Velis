import { useQuery } from '@tanstack/react-query';
import { fetchGitHubWorkflows } from '../lib/api';
import type { GitHubWorkflowRunItem } from '../types/github';

export function useRepositoryWorkflow(repoUrl?: string) {
  return useQuery<GitHubWorkflowRunItem[], Error>({
    queryKey: ['github-repo-workflows', repoUrl],
    queryFn: () => fetchGitHubWorkflows(repoUrl),
    enabled: Boolean(repoUrl),
    staleTime: 1000 * 60 * 3,
  });
}
