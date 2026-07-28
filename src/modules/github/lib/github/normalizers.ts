/**
 * Clean and normalize user-entered GitHub repository URLs
 * Examples:
 *   "https://github.com/facebook/react.git" -> "https://github.com/facebook/react"
 *   "  http://github.com/owner/repo/ " -> "https://github.com/owner/repo"
 */
export function normalizeGitHubUrl(inputUrl?: string): string {
  if (!inputUrl) return '';

  try {
    let clean = inputUrl.trim();

    // Replace http:// with https://
    if (clean.startsWith('http://')) {
      clean = clean.replace(/^http:\/\//i, 'https://');
    }

    // Prepend https:// if user pasted "github.com/owner/repo" or "owner/repo"
    if (!clean.startsWith('https://') && !clean.startsWith('http://')) {
      if (clean.startsWith('github.com')) {
        clean = `https://${clean}`;
      } else if (clean.includes('/') && !clean.includes('://')) {
        clean = `https://github.com/${clean}`;
      }
    }

    const parsed = new URL(clean);
    if (!parsed.hostname.toLowerCase().includes('github.com')) {
      return inputUrl.trim();
    }

    // Strip trailing slashes and .git
    let pathname = parsed.pathname.replace(/\/+$/, '').replace(/\.git$/i, '');

    // Standardize to https://github.com/owner/repo
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return `https://github.com/${parts[0]}/${parts[1]}`;
    }

    return `https://${parsed.hostname}${pathname}`;
  } catch {
    return inputUrl ? inputUrl.trim() : '';
  }
}
