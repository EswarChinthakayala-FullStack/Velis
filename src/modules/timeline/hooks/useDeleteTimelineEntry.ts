import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProjectUpdate } from '../../../lib/supabase/queries/timeline';

export function useDeleteTimelineEntry(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (entryId: string) => {
      return await deleteProjectUpdate(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-updates', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-updates'] });
    },
  });
}

export default useDeleteTimelineEntry;
