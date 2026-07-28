import { useProjectUpdates } from '../../../lib/supabase/queries/timeline';

export function useProjectTimeline(projectId?: string) {
  return useProjectUpdates(projectId);
}

export default useProjectTimeline;
