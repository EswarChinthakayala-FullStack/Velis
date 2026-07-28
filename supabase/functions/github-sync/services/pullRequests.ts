import { fetchFromGitHub } from './github.ts';

export async function fetchOpenPullRequestsCount(owner: string, repo: string): Promise<number> {
  const prs = await fetchFromGitHub<any[]>(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=1`);
  if (!prs || !Array.isArray(prs)) return 0;
  return prs.length;
}
