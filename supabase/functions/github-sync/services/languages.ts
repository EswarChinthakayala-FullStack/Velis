import { fetchFromGitHub } from './github.ts';

export async function fetchLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  const languages = await fetchFromGitHub<Record<string, number>>(`https://api.github.com/repos/${owner}/${repo}/languages`);
  return languages || {};
}
