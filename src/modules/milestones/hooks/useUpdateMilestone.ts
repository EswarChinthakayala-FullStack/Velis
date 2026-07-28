import { useUpdateMilestone as useUpdateMilestoneQuery } from '../../../lib/supabase/queries/milestones';

export function useUpdateMilestone(projectId?: string) {
  return useUpdateMilestoneQuery(projectId);
}

export default useUpdateMilestone;
