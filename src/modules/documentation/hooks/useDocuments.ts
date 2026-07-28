import { useDocuments as useDocumentsQuery } from '../../../lib/supabase/queries/documentation';

export function useDocuments(projectId?: string, isClientOnly = false) {
  return useDocumentsQuery(projectId, isClientOnly);
}

export default useDocuments;
