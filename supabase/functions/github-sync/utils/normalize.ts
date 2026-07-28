export function parseOwnerAndRepo(repoUrl?: string): { owner: string; repo: string } | null {
  if (!repoUrl) return null;

  try {
    const clean = repoUrl.trim().replace(/\.git$/, '');
    const url = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  } catch {
    const parts = repoUrl.trim().split('/').filter(Boolean);
    if (parts.length === 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  }
}
