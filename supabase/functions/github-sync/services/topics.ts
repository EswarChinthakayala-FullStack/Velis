import { fetchFromGitHub } from './github.ts';

export async function fetchTopics(owner: string, repo: string): Promise<string[]> {
  const data = await fetchFromGitHub<{ names?: string[] }>(`https://api.github.com/repos/${owner}/${repo}/topics`);
  return data?.names || [];
}
