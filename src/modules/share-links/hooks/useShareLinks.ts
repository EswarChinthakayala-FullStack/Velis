import { useQuery } from '@tanstack/react-query';
import { fetchProjectShareLinks } from '../lib/supabase/queries/share-links';
import type { ShareLinkItem } from '../lib/types/share-link';

export const shareLinkKeys = {
  all: ['share-links'] as const,
  project: (projectId?: string | null) => ['share-links', projectId || 'all'] as const,
  detail: (id: string) => ['share-links', 'detail', id] as const,
};

export function useShareLinks(projectId?: string | null) {
  return useQuery<ShareLinkItem[]>({
    queryKey: shareLinkKeys.project(projectId),
    queryFn: () => fetchProjectShareLinks(projectId),
    staleTime: 1000 * 30, // 30 seconds
  });
}
