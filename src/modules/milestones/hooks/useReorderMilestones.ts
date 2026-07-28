import { useReorderMilestones as useReorderMilestonesQuery } from '../../../lib/supabase/queries/milestones';

export function useReorderMilestones(projectId?: string) {
  return useReorderMilestonesQuery(projectId);
}

export default useReorderMilestones;
