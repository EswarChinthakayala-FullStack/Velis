import type { FolderTreeNode } from '../types/folder';

const STORAGE_KEY = 'velis_expanded_folders';

export function getSavedExpandedFolderIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {
    // Ignore storage parse errors
  }
  return new Set<string>();
}

export function saveExpandedFolderIds(expandedIds: Set<string>): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(expandedIds)));
  } catch {
    // Ignore
  }
}

/**
 * Finds all ancestor folder IDs for auto-expanding tree parents during search matching.
 */
export function getAncestorFolderIds(
  folderId: string,
  allNodesMap: Map<string, FolderTreeNode>
): Set<string> {
  const ancestors = new Set<string>();
  let curr = allNodesMap.get(folderId);

  while (curr && curr.parentId) {
    ancestors.add(curr.parentId);
    curr = allNodesMap.get(curr.parentId);
  }

  return ancestors;
}
