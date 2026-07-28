import { useCreateProjectUpdate } from '../../../lib/supabase/queries/timeline';

export function useCreateTimelineEntry() {
  return useCreateProjectUpdate();
}

export default useCreateTimelineEntry;
