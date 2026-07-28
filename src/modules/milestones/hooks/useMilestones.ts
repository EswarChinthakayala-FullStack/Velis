import { useMilestones as useMilestonesQuery } from '../../../lib/supabase/queries/milestones';

export function useMilestones(projectId?: string) {
  return useMilestonesQuery(projectId);
}

export default useMilestones;
