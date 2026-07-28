import { useMutation, useQueryClient } from '@tanstack/react-query';
import { regenerateProjectShareLink } from '../lib/supabase/queries/share-links';
import { shareLinkKeys } from './useShareLinks';
import { toast } from '../../../components/ui/toast';

export function useRegenerateShareLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => regenerateProjectShareLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareLinkKeys.all });
      toast.success('Share link token regenerated!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to regenerate share link token');
    },
  });
}
