import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { normalizeClientError } from '../../utils/client-errors';
import type {
  DocumentItem,
  CreateDocumentInput,
  UpdateDocumentInput,
  DocumentVersionItem,
  DocumentCategory,
} from '../../../modules/documentation/lib/types/documentation';
import {
  fetchProjectDocuments,
  fetchDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  fetchDocumentVersions,
  createDocumentVersionRecord,
  restoreDocumentVersion,
} from './documentation';

/**
 * Enterprise Documentation Data Access Layer (PHASE 12)
 * Single source of truth for all project documentation database operations.
 * Pure data layer: ZERO mock data, ZERO SELECT * queries.
 */

export const DOCUMENT_QUERY_KEYS = {
  all: ['documents'] as const,
  list: (projectId?: string) => ['documents', projectId || 'all'] as const,
  detail: (id?: string | null) => ['document', id || ''] as const,
  versions: (id?: string | null) => ['documentVersions', id || ''] as const,
};

/**
 * Fetch all documents belonging to a project
 */
export function useDocuments(projectId?: string, isClientOnly = false) {
  return useQuery<DocumentItem[]>({
    queryKey: DOCUMENT_QUERY_KEYS.list(projectId),
    queryFn: async () => fetchProjectDocuments(projectId, isClientOnly),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch a single document by ID
 */
export function useDocument(id?: string | null) {
  return useQuery<DocumentItem | null>({
    queryKey: DOCUMENT_QUERY_KEYS.detail(id),
    queryFn: async () => (id ? fetchDocumentById(id) : null),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Fetch immutable version history for a document
 */
export function useDocumentVersions(id?: string | null) {
  return useQuery<DocumentVersionItem[]>({
    queryKey: DOCUMENT_QUERY_KEYS.versions(id),
    queryFn: async () => (id ? fetchDocumentVersions(id) : []),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Save document with intelligent change detection, optimistic updates, and automatic versioning
 */
export function useSaveDocument(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<
    DocumentItem,
    Error,
    { id: string; input: UpdateDocumentInput; author?: string; changeSummary?: string },
    { previousDoc?: DocumentItem | null; previousList?: DocumentItem[] }
  >({
    mutationFn: async ({ id, input, author = 'System Lead', changeSummary = 'Autosaved revision' }) => {
      // 1. Fetch current document to compare content
      const existing = await fetchDocumentById(id);

      // Check if content has actually changed
      if (existing && input.content !== undefined && existing.content === input.content) {
        return existing;
      }

      // 2. Increment minor version if content changed
      let nextVersion = input.version || existing?.version || '1.0.0';
      if (existing && input.content !== undefined && existing.content !== input.content) {
        const parts = (existing.version || '1.0.0').split('.');
        if (parts.length === 3 && !isNaN(Number(parts[2]))) {
          nextVersion = `${parts[0]}.${parts[1]}.${Number(parts[2]) + 1}`;
        }
      }

      // 3. Atomically update document
      const updatedDoc = await updateDocument(id, {
        ...input,
        version: nextVersion,
      });

      // 4. Create revision record in document_versions
      if (input.content !== undefined) {
        await createDocumentVersionRecord(
          id,
          input.content,
          nextVersion,
          author,
          changeSummary
        );
      }

      return updatedDoc;
    },
    onMutate: async ({ id, input }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: DOCUMENT_QUERY_KEYS.detail(id) });
      await queryClient.cancelQueries({ queryKey: DOCUMENT_QUERY_KEYS.list(projectId) });

      // Snapshot previous values
      const previousDoc = queryClient.getQueryData<DocumentItem | null>(DOCUMENT_QUERY_KEYS.detail(id));
      const previousList = queryClient.getQueryData<DocumentItem[]>(DOCUMENT_QUERY_KEYS.list(projectId));

      // Optimistically update single document detail cache
      queryClient.setQueryData<DocumentItem | null>(DOCUMENT_QUERY_KEYS.detail(id), (old) => {
        if (!old) return null;
        return {
          ...old,
          title: input.title !== undefined ? input.title : old.title,
          content: input.content !== undefined ? input.content : old.content,
          category: input.category !== undefined ? input.category : old.category,
          status: input.status !== undefined ? input.status : old.status,
          version: input.version !== undefined ? input.version : old.version,
          author: input.author !== undefined ? input.author : old.author,
          isClientVisible: input.isClientVisible !== undefined ? input.isClientVisible : old.isClientVisible,
          updatedAt: new Date().toISOString(),
        };
      });

      // Optimistically update document list cache
      queryClient.setQueryData<DocumentItem[]>(DOCUMENT_QUERY_KEYS.list(projectId), (oldList) => {
        if (!oldList) return [];
        return oldList.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                title: input.title !== undefined ? input.title : doc.title,
                content: input.content !== undefined ? input.content : doc.content,
                category: input.category !== undefined ? input.category : doc.category,
                status: input.status !== undefined ? input.status : doc.status,
                version: input.version !== undefined ? input.version : doc.version,
                author: input.author !== undefined ? input.author : doc.author,
                isClientVisible: input.isClientVisible !== undefined ? input.isClientVisible : doc.isClientVisible,
                updatedAt: new Date().toISOString(),
              }
            : doc
        );
      });

      return { previousDoc, previousList };
    },
    onError: (err, { id }, context) => {
      // Rollback on failure
      if (context?.previousDoc) {
        queryClient.setQueryData(DOCUMENT_QUERY_KEYS.detail(id), context.previousDoc);
      }
      if (context?.previousList) {
        queryClient.setQueryData(DOCUMENT_QUERY_KEYS.list(projectId), context.previousList);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEYS.list(projectId) });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEYS.versions(id) });
    },
  });
}

/**
 * Create new document hook
 */
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation<DocumentItem, Error, CreateDocumentInput>({
    mutationFn: async (input) => createDocument(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEYS.all });
    },
  });
}

/**
 * Delete document hook
 */
export function useDeleteDocument(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEYS.all });
    },
  });
}

/**
 * Restore previous version hook
 */
export function useRestoreDocumentVersion(documentId?: string) {
  const queryClient = useQueryClient();

  return useMutation<
    DocumentItem,
    Error,
    { documentId: string; versionContent: string; targetVersion: string }
  >({
    mutationFn: async ({ documentId: targetId, versionContent, targetVersion }) =>
      restoreDocumentVersion(targetId, versionContent, targetVersion),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEYS.detail(variables.documentId) });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEYS.versions(variables.documentId) });
    },
  });
}
