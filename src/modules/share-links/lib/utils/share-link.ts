import { addDays, isPast } from 'date-fns';
import type { ShareLinkItem, ShareLinkStatus, ShareLinkStats, ExpirationOption } from '../types/share-link';

/**
 * Formats full share portal URL for client access using token.
 */
export function formatShareUrl(token: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://esflow.app';
  return `${origin}/share/${token}`;
}

/**
 * Formats a shortened preview of the share portal URL for tables.
 */
export function shortenShareUrl(url: string, maxLength = 36): string {
  if (!url) return '';
  if (url.length <= maxLength) return url;
  return `${url.slice(0, maxLength)}...`;
}

/**
 * Calculates current status of a share link (Active, Expired, Disabled, Protected).
 */
export function getShareLinkStatus(link: ShareLinkItem): ShareLinkStatus {
  if (!link.isActive || Boolean(link.revokedAt)) {
    return 'disabled';
  }
  if (link.expiresAt && isPast(new Date(link.expiresAt))) {
    return 'expired';
  }
  if (link.passwordHash || link.hasPassword) {
    return 'protected';
  }
  return 'active';
}

/**
 * Computes live statistics summary across a list of share links.
 */
export function calculateShareLinkStats(links: ShareLinkItem[]): ShareLinkStats {
  let activeCount = 0;
  let expiredCount = 0;
  let disabledCount = 0;
  let totalViews = 0;
  let passwordProtectedCount = 0;
  let lastAccessedAt: string | null = null;

  for (const link of links) {
    const status = getShareLinkStatus(link);
    if (status === 'active' || status === 'protected') {
      activeCount++;
    }
    if (status === 'expired') {
      expiredCount++;
    }
    if (status === 'disabled') {
      disabledCount++;
    }
    if (link.passwordHash || link.hasPassword) {
      passwordProtectedCount++;
    }

    totalViews += link.currentViews || 0;

    if (link.lastAccessedAt) {
      if (!lastAccessedAt || new Date(link.lastAccessedAt) > new Date(lastAccessedAt)) {
        lastAccessedAt = link.lastAccessedAt;
      }
    }
  }

  return {
    activeCount,
    expiredCount,
    disabledCount,
    totalViews,
    lastAccessedAt,
    passwordProtectedCount,
  };
}

/**
 * Converts an ExpirationOption preset into an ISO date string (or null for never).
 */
export function resolveExpirationDate(preset: ExpirationOption, customDate?: string | null): string | null {
  const now = new Date();
  switch (preset) {
    case '1d':
      return addDays(now, 1).toISOString();
    case '7d':
      return addDays(now, 7).toISOString();
    case '30d':
      return addDays(now, 30).toISOString();
    case '90d':
      return addDays(now, 90).toISOString();
    case 'custom':
      return customDate ? new Date(customDate).toISOString() : null;
    case 'never':
    default:
      return null;
  }
}

/**
 * Evaluates password strength score (0 to 4) and label.
 */
export function getPasswordStrength(password?: string | null): { score: number; label: string; color: string } {
  if (!password) {
    return { score: 0, label: 'Empty', color: 'bg-zinc-800' };
  }

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-sky-500' };
  return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
}
