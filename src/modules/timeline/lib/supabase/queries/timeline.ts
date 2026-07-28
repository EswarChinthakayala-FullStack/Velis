import { supabase } from '../../../../../lib/supabase/client';
import { normalizeClientError } from '../../../../../lib/utils/client-errors';
import type { TimelineEntry, CreateTimelineEntryPayload } from '../../types/timeline';

const TIMELINE_SELECT_COLUMNS = 'id, project_id, title, description, entry_date, attachments, created_by, created_at';

function mapRowToTimelineEntry(row: any): TimelineEntry {
  let parsedAttachments = [];
  if (Array.isArray(row.attachments)) {
    parsedAttachments = row.attachments;
  } else if (typeof row.attachments === 'string') {
    try {
      parsedAttachments = JSON.parse(row.attachments);
    } catch {
      parsedAttachments = [];
    }
  }

  // Infer updateType & tags from JSON or title and clean description text
  let rawDesc = String(row.description || '');
  let updateType = 'general';

  const typeMatch = rawDesc.match(/\[TYPE:([^\]]+)\]/);
  if (typeMatch && typeMatch[1]) {
    updateType = typeMatch[1];
    rawDesc = rawDesc.replace(/\[TYPE:[^\]]+\]\s*/g, '');
  } else if (rawDesc.toLowerCase().includes('feature') || row.title.toLowerCase().includes('feature')) {
    updateType = 'feature';
  } else if (rawDesc.toLowerCase().includes('fix') || row.title.toLowerCase().includes('fix')) {
    updateType = 'bug_fix';
  } else if (rawDesc.toLowerCase().includes('deploy') || row.title.toLowerCase().includes('deploy')) {
    updateType = 'deployment';
  } else if (rawDesc.toLowerCase().includes('milestone') || row.title.toLowerCase().includes('milestone')) {
    updateType = 'milestone';
  } else if (rawDesc.toLowerCase().includes('doc') || row.title.toLowerCase().includes('doc')) {
    updateType = 'documentation';
  }

  return {
    id: String(row.id),
    projectId: String(row.project_id),
    title: String(row.title),
    description: rawDesc,
    entryDate: row.entry_date ? String(row.entry_date) : String(row.created_at),
    updateType: updateType as any,
    visibility: 'public',
    tags: [],
    attachments: parsedAttachments.map((a: any) => ({
      id: String(a.id || Math.random()),
      fileName: String(a.fileName || a.file_name || a.name || 'Attachment'),
      fileUrl: String(a.fileUrl || a.file_url || a.url || ''),
      mimeType: a.mimeType || a.mime_type || undefined,
      sizeBytes: a.sizeBytes || a.size_bytes || undefined,
    })),
    createdBy: row.created_by ? String(row.created_by) : undefined,
    createdAt: String(row.created_at),
  };
}

/**
 * Fetch project timeline updates from Supabase project_updates table
 */
export async function fetchProjectTimeline(projectId?: string): Promise<TimelineEntry[]> {
  try {
    let query = (supabase as any)
      .from('project_updates')
      .select(TIMELINE_SELECT_COLUMNS)
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error || !Array.isArray(data)) {
      return [];
    }

    return data.map(mapRowToTimelineEntry);
  } catch (err: unknown) {
    console.warn('[Supabase Timeline Query Warning]:', err);
    return [];
  }
}

/**
 * Create a new timeline entry in project_updates
 */
export async function createTimelineEntry(payload: CreateTimelineEntryPayload): Promise<TimelineEntry> {
  if (!payload.projectId) throw new Error('Project ID is required.');
  if (!payload.title.trim()) throw new Error('Title is required.');

  try {
    const record = {
      project_id: payload.projectId,
      title: payload.title.trim(),
      description: payload.description || '',
      content: payload.description || payload.title.trim(),
      entry_date: payload.entryDate || new Date().toISOString().split('T')[0],
      attachments: payload.attachments || [],
    };

    const { data, error } = await (supabase as any)
      .from('project_updates')
      .insert(record)
      .select(TIMELINE_SELECT_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToTimelineEntry(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create timeline update.';
    throw new Error(message);
  }
}

/**
 * Delete a timeline update entry
 */
export async function deleteTimelineEntry(entryId: string): Promise<boolean> {
  if (!entryId) throw new Error('Entry ID is required.');

  try {
    const { error } = await (supabase as any)
      .from('project_updates')
      .delete()
      .eq('id', entryId);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete timeline entry.';
    throw new Error(message);
  }
}
