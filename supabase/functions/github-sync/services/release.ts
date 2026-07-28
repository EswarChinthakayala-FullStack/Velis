import { fetchFromGitHub } from './github.ts';
import type { GitHubReleaseResponse } from '../utils/types.ts';

export async function fetchLatestRelease(owner: string, repo: string): Promise<GitHubReleaseResponse | null> {
  return await fetchFromGitHub<GitHubReleaseResponse>(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
}
