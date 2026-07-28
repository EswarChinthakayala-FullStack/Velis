import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateProjectShareLink } from '../lib/supabase/queries/share-links';
import { shareLinkKeys } from './useShareLinks';
import type { GenerateShareLinkInput } from '../lib/types/share-link';
import { toast } from '../../../components/ui/toast';

export function useGenerateShareLink(projectId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateShareLinkInput) => generateProjectShareLink(input),
    onSuccess: (newLink) => {
      queryClient.invalidateQueries({ queryKey: shareLinkKeys.all });
      toast.success('Share link generated successfully!');
      return newLink;
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to generate share link');
    },
  });
}
