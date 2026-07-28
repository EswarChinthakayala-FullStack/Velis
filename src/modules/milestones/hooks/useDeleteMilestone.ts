import { useDeleteMilestone as useDeleteMilestoneQuery } from '../../../lib/supabase/queries/milestones';

export function useDeleteMilestone(projectId?: string) {
  return useDeleteMilestoneQuery(projectId);
}

export default useDeleteMilestone;
