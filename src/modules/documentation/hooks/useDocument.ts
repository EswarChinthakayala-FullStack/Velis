import { useDocument as useDocumentQuery } from '../../../lib/supabase/queries/documentation';

export function useDocument(documentId?: string | null) {
  return useDocumentQuery(documentId);
}

export default useDocument;
