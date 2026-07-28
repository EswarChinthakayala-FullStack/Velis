import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProjectShareLink } from '../lib/supabase/queries/share-links';
import { shareLinkKeys } from './useShareLinks';
import { toast } from '../../../components/ui/toast';

export function useDeleteShareLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => deleteProjectShareLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareLinkKeys.all });
      toast.info('Share link deleted');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete share link');
    },
  });
}
