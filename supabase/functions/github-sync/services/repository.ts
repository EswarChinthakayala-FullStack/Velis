import { fetchFromGitHub } from './github.ts';
import type { GitHubRepoResponse } from '../utils/types.ts';

export async function fetchRepositoryDetails(owner: string, repo: string): Promise<GitHubRepoResponse | null> {
  return await fetchFromGitHub<GitHubRepoResponse>(`https://api.github.com/repos/${owner}/${repo}`);
}
