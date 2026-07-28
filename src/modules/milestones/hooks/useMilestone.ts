import { useMilestone as useMilestoneQuery } from '../../../lib/supabase/queries/milestones';

export function useMilestone(id?: string | null) {
  return useMilestoneQuery(id);
}

export default useMilestone;
