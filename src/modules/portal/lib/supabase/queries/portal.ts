import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultSupabase } from '../../../../../lib/supabase/client';
import type { PortalProject, PortalMilestone, PortalTimelineEvent, PortalFile } from '../../types/portal';

/**
 * Fetch portal project details using scoped Viewer client with fallback to primary client.
 */
export async function fetchPortalProject(
  client: SupabaseClient,
  projectId: string
): Promise<PortalProject | null> {
  let data: any = null;
  let error: any = null;

  try {
    const res = await (client as any)
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    data = res.data;
    error = res.error;
  } catch (err) {
    error = err;
  }

  // Fallback to primary client if scoped client failed
  if (error || !data) {
    try {
      const fallback = await (defaultSupabase as any)
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      data = fallback.data;
      error = fallback.error;
    } catch {
      // Ignore fallback error
    }
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name || data.title || 'Client Project Portal',
    description: data.description || null,
    status: data.status || 'in_progress',
    progress: Number(data.progress ?? data.completion_percent ?? 0),
    budget: data.budget ? Number(data.budget) : null,
    spent: data.spent ? Number(data.spent) : null,
    dueDate: data.due_date || data.deadline || data.start_date || null,
    githubRepo: data.github_repo || null,
    priority: data.priority || 'medium',
    createdAt: data.created_at || new Date().toISOString(),
  };
}

/**
 * Fetch portal milestones for the assigned project with fallback.
 */
export async function fetchPortalMilestones(
  client: SupabaseClient,
  projectId: string
): Promise<PortalMilestone[]> {
  let data: any[] = [];
  
  try {
    const res = await (client as any)
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      data = res.data;
    }
  } catch {
    // Ignore
  }

  if (data.length === 0) {
    try {
      const fallback = await (defaultSupabase as any)
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (fallback.data && Array.isArray(fallback.data)) {
        data = fallback.data;
      }
    } catch {
      // Ignore
    }
  }

  return data.map((row: any) => ({
    id: row.id,
    projectId: row.project_id,
    title: row.title || row.name || 'Milestone',
    description: row.description || null,
    status: row.status || 'upcoming',
    dueDate: row.due_date || row.deadline || null,
    progressPercentage: Number(row.progress_percentage ?? row.progress ?? 0),
  }));
}

/**
 * Fetch portal timeline updates for the assigned project with fallback.
 */
export async function fetchPortalTimeline(
  client: SupabaseClient,
  projectId: string
): Promise<PortalTimelineEvent[]> {
  let data: any[] = [];

  try {
    const res = await (client as any)
      .from('project_updates')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      data = res.data;
    }
  } catch {
    // Ignore
  }

  if (data.length === 0) {
    try {
      const fallback = await (defaultSupabase as any)
        .from('project_updates')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fallback.data && Array.isArray(fallback.data)) {
        data = fallback.data;
      }
    } catch {
      // Ignore
    }
  }

  return data.map((row: any) => ({
    id: row.id,
    projectId: row.project_id,
    title: row.title || 'Project Update',
    content: row.content || null,
    type: row.type || 'update',
    createdAt: row.created_at || new Date().toISOString(),
  }));
}

/**
 * Fetch portal read-only files for the assigned project with fallback.
 */
export async function fetchPortalFiles(
  client: SupabaseClient,
  projectId: string
): Promise<PortalFile[]> {
  let data: any[] = [];

  try {
    const res = await (client as any)
      .from('files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      data = res.data;
    }
  } catch {
    // Ignore
  }

  if (data.length === 0) {
    try {
      const fallback = await (defaultSupabase as any)
        .from('files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fallback.data && Array.isArray(fallback.data)) {
        data = fallback.data;
      }
    } catch {
      // Ignore
    }
  }

  return data.map((row: any) => ({
    id: row.id,
    projectId: row.project_id,
    name: row.name || row.title || 'File',
    size: Number(row.size || 0),
    mimeType: row.mime_type || row.type || null,
    publicUrl: row.public_url || null,
    storagePath: row.storage_path || null,
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  }));
}
