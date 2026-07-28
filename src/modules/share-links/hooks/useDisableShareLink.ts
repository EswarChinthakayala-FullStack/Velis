import { useMutation, useQueryClient } from '@tanstack/react-query';
import { disableProjectShareLink } from '../lib/supabase/queries/share-links';
import { shareLinkKeys } from './useShareLinks';
import { toast } from '../../../components/ui/toast';

export function useDisableShareLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => disableProjectShareLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareLinkKeys.all });
      toast.info('Share link disabled');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to disable share link');
    },
  });
}
