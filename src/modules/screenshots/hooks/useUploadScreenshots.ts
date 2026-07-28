import { useUploadScreenshotMutation } from '../../../lib/supabase/queries/screenshots';

export function useUploadScreenshots(projectId?: string | null) {
  return useUploadScreenshotMutation(projectId);
}

export default useUploadScreenshots;
