import { useUpdateTaskStatus } from '../../../lib/supabase/queries/tasks';
import type { MoveTaskPayload } from '../lib/types/kanban';

export function useMoveTask(projectId?: string) {
  const mutation = useUpdateTaskStatus(projectId);

  return {
    ...mutation,
    mutate: (payload: MoveTaskPayload) => {
      mutation.mutate({
        taskId: payload.taskId,
        status: payload.targetStatus,
        sortOrder: payload.targetSortOrder,
      });
    },
    mutateAsync: async (payload: MoveTaskPayload) => {
      return await mutation.mutateAsync({
        taskId: payload.taskId,
        status: payload.targetStatus,
        sortOrder: payload.targetSortOrder,
      });
    },
  };
}

export default useMoveTask;
