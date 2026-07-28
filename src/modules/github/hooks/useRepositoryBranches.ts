import { useQuery } from '@tanstack/react-query';
import { parseGitHubUrl } from '../lib/api';
import type { GitHubBranchItem } from '../lib/github/types';

export function useRepositoryBranches(repoUrl?: string) {
  const parsed = parseGitHubUrl(repoUrl);

  return useQuery<GitHubBranchItem[]>({
    queryKey: ['github-branches', parsed?.owner, parsed?.repo],
    queryFn: async (): Promise<GitHubBranchItem[]> => {
      if (!parsed) return [];

      try {
        const res = await fetch(
          `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/branches?per_page=100`,
          {
            headers: { Accept: 'application/vnd.github.v3+json' },
          }
        );

        if (!res.ok) return [];

        const data = await res.json();
        if (!Array.isArray(data)) return [];

        return data.map((b: any) => ({
          name: String(b.name),
          commitSha: String(b.commit?.sha || ''),
          protected: Boolean(b.protected),
        }));
      } catch {
        return [];
      }
    },
    enabled: Boolean(parsed?.owner && parsed?.repo),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
}

export default useRepositoryBranches;
