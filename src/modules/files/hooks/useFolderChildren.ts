import { useFolderChildren as useFolderChildrenQuery } from '../../../lib/supabase/queries/folders';

export function useFolderChildren(projectId?: string | null, parentId?: string | null) {
  return useFolderChildrenQuery(projectId, parentId);
}

export default useFolderChildren;
