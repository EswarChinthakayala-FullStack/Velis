import { useProjectFiles as useProjectFilesQuery } from '../../../lib/supabase/queries/files';

export function useProjectFiles(projectId?: string | null, folderId?: string | null) {
  return useProjectFilesQuery(projectId, folderId);
}

export default useProjectFiles;
