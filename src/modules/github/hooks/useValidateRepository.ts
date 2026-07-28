import { useMutation } from '@tanstack/react-query';
import { validateGitHubUrlString } from '../lib/github/validators';
import { fetchGitHubRepoMetadata, parseGitHubUrl } from '../lib/api';
import type { ValidateRepoResult, GitHubBranchItem } from '../lib/github/types';

export function useValidateRepository() {
  return useMutation<ValidateRepoResult, Error, string>({
    mutationFn: async (url: string): Promise<ValidateRepoResult> => {
      // 1. URL Structure Validation
      const localCheck = validateGitHubUrlString(url);
      if (!localCheck.isValid || !localCheck.owner || !localCheck.repo) {
        return {
          isValid: false,
          metadata: null,
          branches: [],
          error: localCheck.error || 'Invalid repository URL.',
        };
      }

      // 2. Query GitHub REST API for live metadata
      try {
        const metadata = await fetchGitHubRepoMetadata(url);
        if (!metadata) {
          return {
            isValid: false,
            metadata: null,
            branches: [],
            error: 'Repository not found on GitHub or is private/inaccessible.',
          };
        }

        // 3. Fetch branches from GitHub REST API
        let branches: GitHubBranchItem[] = [];
        try {
          const res = await fetch(`https://api.github.com/repos/${localCheck.owner}/${localCheck.repo}/branches?per_page=100`, {
            headers: { Accept: 'application/vnd.github.v3+json' },
          });

          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              branches = data.map((b: any) => ({
                name: String(b.name),
                commitSha: String(b.commit?.sha || ''),
                protected: Boolean(b.protected),
              }));
            }
          }
        } catch {
          // Non-fatal if branch list fails, fallback to default_branch
        }

        if (branches.length === 0 && metadata.default_branch) {
          branches = [{ name: metadata.default_branch, commitSha: '', protected: false }];
        }

        return {
          isValid: true,
          metadata,
          branches,
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to validate repository.';
        return {
          isValid: false,
          metadata: null,
          branches: [],
          error: message,
        };
      }
    },
  });
}

export default useValidateRepository;
