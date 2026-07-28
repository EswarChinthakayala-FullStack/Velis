import { fetchFromGitHub } from './github.ts';
import type { GitHubBranchInfo } from '../utils/types.ts';

export async function fetchBranches(owner: string, repo: string): Promise<GitHubBranchInfo[]> {
  const data = await fetchFromGitHub<any[]>(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`);
  if (!data || !Array.isArray(data)) return [];

  return data.map((b: any) => ({
    name: String(b.name),
    protected: Boolean(b.protected),
  }));
}
