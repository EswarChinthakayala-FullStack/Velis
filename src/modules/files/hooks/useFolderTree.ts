import { useFolderTree as useFolderTreeQuery } from '../../../lib/supabase/queries/folders';

export function useFolderTree(projectId?: string | null) {
  return useFolderTreeQuery(projectId);
}

export default useFolderTree;
