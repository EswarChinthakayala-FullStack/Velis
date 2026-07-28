import { z } from 'zod';
import { normalizeGitHubUrl } from './normalizers';

const REJECTED_SEGMENTS = [
  'issues',
  'pull',
  'pulls',
  'wiki',
  'tree',
  'blob',
  'commit',
  'commits',
  'releases',
  'settings',
  'actions',
  'projects',
  'security',
  'pulse',
  'discussions',
  'raw',
  'blame',
];

export function validateGitHubUrlString(url: string): { isValid: boolean; error?: string; owner?: string; repo?: string } {
  if (!url || !url.trim()) {
    return { isValid: false, error: 'Repository URL is required.' };
  }

  const normalized = normalizeGitHubUrl(url);

  try {
    const parsed = new URL(normalized);

    if (parsed.protocol !== 'https:') {
      return { isValid: false, error: 'URL must use secure HTTPS protocol (https://).' };
    }

    if (parsed.hostname.toLowerCase() === 'gist.github.com') {
      return { isValid: false, error: 'Gist URLs are not supported. Provide a repository URL.' };
    }

    if (!parsed.hostname.toLowerCase().endsWith('github.com')) {
      return { isValid: false, error: 'URL must be a valid github.com domain.' };
    }

    const pathSegments = parsed.pathname.split('/').filter(Boolean);

    if (pathSegments.length < 2) {
      return { isValid: false, error: 'Provide a full repository path in format: https://github.com/owner/repository' };
    }

    const owner = pathSegments[0];
    const repo = pathSegments[1];

    if (REJECTED_SEGMENTS.includes(repo.toLowerCase())) {
      return { isValid: false, error: `Invalid URL: Cannot use a GitHub sub-resource path (/${repo}). Provide root repository URL.` };
    }

    if (pathSegments.length > 2) {
      const extraSegment = pathSegments[2].toLowerCase();
      if (REJECTED_SEGMENTS.includes(extraSegment)) {
        return { isValid: false, error: `Invalid URL: Contains sub-resource path (/${extraSegment}). Remove branch/file paths.` };
      }
    }

    return {
      isValid: true,
      owner,
      repo,
    };
  } catch {
    return { isValid: false, error: 'Invalid URL structure.' };
  }
}

export const gitHubRepoUrlSchema = z.string()
  .min(1, 'Repository URL is required.')
  .transform((val) => normalizeGitHubUrl(val))
  .refine((val) => {
    const res = validateGitHubUrlString(val);
    return res.isValid;
  }, {
    message: 'Invalid GitHub repository URL format. Example: https://github.com/owner/repository',
  });

export const gitHubFormSchema = z.object({
  repoUrl: gitHubRepoUrlSchema,
  organization: z.string().min(1, 'Organization / Owner is required.'),
  repoName: z.string().min(1, 'Repository name is required.'),
  branch: z.string().min(1, 'Default branch is required.'),
  visibility: z.enum(['public', 'private']),
});

export type GitHubFormSchemaValues = z.infer<typeof gitHubFormSchema>;
