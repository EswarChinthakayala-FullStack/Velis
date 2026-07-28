import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { normalizeClientError } from '../../utils/client-errors';
import type { FolderItem } from '../../../modules/files/lib/types/file';
import type { FolderTreeNode } from '../../../modules/files/lib/types/folder';
import { buildFolderTree } from '../../../modules/files/lib/utils/tree-builder';

const BUCKET_NAME = 'project-assets';

/**
 * Fetch all folders for a project and build a recursive FolderTreeNode hierarchy.
 * Queries DB `folders` table directly.
 */
export async function fetchFolderTreeData(projectId?: string | null): Promise<FolderTreeNode[]> {
  try {
    let flatFolders: FolderItem[] = [];

    // Query DB `folders`
    try {
      let query = (supabase as any).from('folders').select('id, project_id, parent_id, name');
      if (projectId && projectId !== 'all') {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('name', { ascending: true });
      if (!error && data && Array.isArray(data)) {
        flatFolders = data.map((f: any) => ({
          id: f.id,
          projectId: f.project_id,
          parentId: f.parent_id,
          name: f.name,
          createdAt: f.created_at || new Date().toISOString(),
          updatedAt: f.updated_at || new Date().toISOString(),
        }));
      }
    } catch {
      // Ignore
    }

    // Storage listing fallback if DB flatFolders is empty
    if (flatFolders.length === 0) {
      const storagePrefix = `${projectId || 'global'}/root`;
      const { data: storageObjects } = await supabase.storage
        .from(BUCKET_NAME)
        .list(storagePrefix, { limit: 100 });

      if (storageObjects) {
        for (const obj of storageObjects) {
          if (obj.id === null) {
            flatFolders.push({
              id: `${storagePrefix}/${obj.name}`,
              projectId: projectId || null,
              parentId: null,
              name: obj.name,
              createdAt: obj.created_at || new Date().toISOString(),
              updatedAt: obj.updated_at || new Date().toISOString(),
            });
          }
        }
      }
    }

    return buildFolderTree(flatFolders);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

/**
 * Fetch subfolder children of a specific parent folder ID.
 */
export async function fetchFolderChildrenData(
  projectId?: string | null,
  parentId?: string | null
): Promise<FolderItem[]> {
  try {
    let children: FolderItem[] = [];

    try {
      let query = (supabase as any).from('folders').select('id, project_id, parent_id, name');
      if (projectId && projectId !== 'all') {
        query = query.eq('project_id', projectId);
      }
      if (parentId) {
        query = query.eq('parent_id', parentId);
      } else {
        query = query.is('parent_id', null);
      }

      const { data, error } = await query.order('name', { ascending: true });
      if (!error && data && Array.isArray(data)) {
        children = data.map((f: any) => ({
          id: f.id,
          projectId: f.project_id,
          parentId: f.parent_id,
          name: f.name,
          createdAt: f.created_at || new Date().toISOString(),
          updatedAt: f.updated_at || new Date().toISOString(),
        }));
      }
    } catch {
      // Fallback
    }

    return children;
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

/**
 * Create a folder in DB `folders`.
 */
export async function createFolder(
  name: string,
  projectId?: string | null,
  parentId?: string | null
): Promise<FolderItem> {
  let targetProjectId = projectId && projectId !== 'all' ? projectId : null;

  if (!targetProjectId) {
    try {
      const { data: projData } = await (supabase as any).from('projects').select('id').limit(1).single();
      if (projData?.id) {
        targetProjectId = projData.id;
      }
    } catch {
      // Ignore
    }
  }

  const newFolderId = crypto.randomUUID();
  const newFolderPayload = {
    id: newFolderId,
    project_id: targetProjectId || null,
    parent_id: parentId || null,
    name: name.trim(),
  };

  try {
    const { data, error } = await (supabase as any)
      .from('folders')
      .insert(newFolderPayload)
      .select()
      .single();

    if (error) {
      console.warn('Supabase DB folder insert warning:', error.message);
    } else if (data) {
      return {
        id: (data as any).id,
        projectId: (data as any).project_id,
        parentId: (data as any).parent_id,
        name: (data as any).name,
        createdAt: (data as any).created_at || new Date().toISOString(),
        updatedAt: (data as any).updated_at || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Folder creation exception:', err);
  }

  return {
    id: newFolderId,
    projectId: targetProjectId || null,
    parentId: parentId || null,
    name: name.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Rename a folder in DB `folders`.
 */
export async function renameFolder(folderId: string, newName: string): Promise<void> {
  try {
    await (supabase as any)
      .from('folders')
      .update({ name: newName.trim() })
      .eq('id', folderId);
  } catch {
    // Fallback
  }
}

/**
 * Delete a folder in DB `folders`.
 */
export async function deleteFolder(folderId: string): Promise<void> {
  try {
    await (supabase as any).from('folders').delete().eq('id', folderId);
  } catch {
    // Fallback
  }
}

// --- Reusable React Query Hooks ---

export function useFolderTree(projectId?: string | null) {
  return useQuery<FolderTreeNode[], Error>({
    queryKey: ['folder-tree', projectId || 'all'],
    queryFn: () => fetchFolderTreeData(projectId),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useFolderChildren(projectId?: string | null, parentId?: string | null) {
  return useQuery<FolderItem[], Error>({
    queryKey: ['folder-children', projectId || 'all', parentId || 'root'],
    queryFn: () => fetchFolderChildrenData(projectId, parentId),
    enabled: Boolean(parentId),
    staleTime: 1000 * 30,
  });
}

export function useCreateFolderMutation(projectId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation<FolderItem, Error, { name: string; parentId?: string | null }>({
    mutationFn: ({ name, parentId }) => createFolder(name, projectId, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useRenameFolderMutation(projectId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { folderId: string; newName: string }>({
    mutationFn: ({ folderId, newName }) => renameFolder(folderId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDeleteFolderMutation(projectId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (folderId: string) => deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}
