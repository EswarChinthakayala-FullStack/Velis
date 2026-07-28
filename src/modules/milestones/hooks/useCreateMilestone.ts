import { useCreateMilestone as useCreateMilestoneQuery } from '../../../lib/supabase/queries/milestones';

export function useCreateMilestone() {
  return useCreateMilestoneQuery();
}

export default useCreateMilestone;
