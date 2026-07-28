export function getGitHubHeaders(): Record<string, string> {
  const token = Deno.env.get('GITHUB_PAT') || Deno.env.get('GITHUB_TOKEN') || Deno.env.get('GITHUB_SECRET');

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Velis-App/1.0 Enterprise-Sync',
  };

  if (token) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
}

export async function fetchFromGitHub<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: getGitHubHeaders() });

    if (!res.ok) {
      if (res.status === 404) return null;
      if (res.status === 403) {
        const remaining = res.headers.get('x-ratelimit-remaining');
        if (remaining === '0') {
          console.warn('[GitHub API Rate Limit Warning]: Exceeded remaining quota.');
        }
        return null;
      }
      console.warn(`[GitHub API Notice]: ${url} returned status ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (err: unknown) {
    console.error('[GitHub Service Error]:', err);
    return null;
  }
}
