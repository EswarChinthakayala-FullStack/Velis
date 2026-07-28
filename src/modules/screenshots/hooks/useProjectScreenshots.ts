import { useProjectScreenshots as useProjectScreenshotsQuery } from '../../../lib/supabase/queries/screenshots';

export function useProjectScreenshots(projectId?: string | null) {
  return useProjectScreenshotsQuery(projectId);
}

export default useProjectScreenshots;
