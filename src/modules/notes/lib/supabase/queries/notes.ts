import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../../../lib/supabase';
import type { NoteItem, CreateNoteInput, UpdateNoteInput } from '../../../types/note';

const NOTE_SELECT_COLUMNS =
  'id, project_id, client_id, title, content, category, is_pinned, is_archived, tags, attachments, created_by, created_at, updated_at';

const NOTE_CORE_COLUMNS =
  'id, project_id, client_id, content, created_by, created_at';

function mapRowToNote(row: any): NoteItem {
  return {
    id: String(row.id),
    projectId: row.project_id ? String(row.project_id) : undefined,
    clientId: row.client_id ? String(row.client_id) : undefined,
    title: row.title || 'Untitled Note',
    content: row.content || '',
    category: row.category || 'general',
    isPinned: Boolean(row.is_pinned),
    isArchived: Boolean(row.is_archived),
    tags: Array.isArray(row.tags) ? row.tags : [],
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    createdBy: row.created_by ? String(row.created_by) : undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  };
}

export async function fetchNotes(projectId?: string | null, clientId?: string | null): Promise<NoteItem[]> {
  try {
    let query = (supabase as any)
      .from('notes')
      .select(NOTE_SELECT_COLUMNS)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (projectId && projectId !== 'all') {
      query = query.eq('project_id', projectId);
    }
    if (clientId && clientId !== 'all') {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapRowToNote);
  } catch (err: any) {
    // Fallback if enhanced columns are missing in remote database table
    try {
      let fallbackQuery = (supabase as any)
        .from('notes')
        .select(NOTE_CORE_COLUMNS)
        .order('created_at', { ascending: false });

      if (projectId && projectId !== 'all') {
        fallbackQuery = fallbackQuery.eq('project_id', projectId);
      }
      if (clientId && clientId !== 'all') {
        fallbackQuery = fallbackQuery.eq('client_id', clientId);
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      if (fallbackError) throw fallbackError;
      return (fallbackData || []).map(mapRowToNote);
    } catch (fallbackErr: any) {
      console.warn('Unable to load notes from Supabase:', fallbackErr?.message || fallbackErr);
      return [];
    }
  }
}

export function useNotes(projectId?: string | null, clientId?: string | null) {
  return useQuery({
    queryKey: ['notes', projectId || 'all', clientId || 'all'],
    queryFn: () => fetchNotes(projectId, clientId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id || null;

      try {
        const payload: any = {
          project_id: input.projectId || null,
          client_id: input.clientId || null,
          title: input.title,
          content: input.content,
          category: input.category || 'general',
          is_pinned: input.isPinned || false,
          is_archived: input.isArchived || false,
          tags: input.tags || [],
          attachments: input.attachments || [],
        };
        if (currentUserId) {
          payload.created_by = currentUserId;
        }

        const { data, error } = await (supabase as any)
          .from('notes')
          .insert(payload)
          .select(NOTE_SELECT_COLUMNS)
          .single();

        if (error) throw error;
        return data;
      } catch (err: any) {
        // Fallback insert for core 0017_notes columns
        const fallbackPayload: any = {
          project_id: input.projectId || null,
          client_id: input.clientId || null,
          content: input.content || input.title,
        };
        if (currentUserId) {
          fallbackPayload.created_by = currentUserId;
        }

        const { data: fallbackData, error: fallbackError } = await (supabase as any)
          .from('notes')
          .insert(fallbackPayload)
          .select(NOTE_CORE_COLUMNS)
          .single();

        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateNoteInput) => {
      try {
        const payload: any = {
          title: input.title,
          content: input.content,
          category: input.category,
          project_id: input.projectId,
          client_id: input.clientId,
          is_pinned: input.isPinned,
          is_archived: input.isArchived,
          tags: input.tags,
          attachments: input.attachments,
          updated_at: new Date().toISOString(),
        };
        Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

        const { data, error } = await (supabase as any)
          .from('notes')
          .update(payload)
          .eq('id', input.id)
          .select(NOTE_SELECT_COLUMNS)
          .single();

        if (error) throw error;
        return data;
      } catch (err: any) {
        const { data: fallbackData, error: fallbackError } = await (supabase as any)
          .from('notes')
          .update({ content: input.content || input.title })
          .eq('id', input.id)
          .select(NOTE_CORE_COLUMNS)
          .single();

        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function usePinNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isPinned }: { id: string; isPinned: boolean }) => {
      const { error } = await (supabase as any)
        .from('notes')
        .update({ is_pinned: isPinned })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useArchiveNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }) => {
      const { error } = await (supabase as any)
        .from('notes')
        .update({ is_archived: isArchived })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
