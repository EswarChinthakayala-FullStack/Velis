import { useState, useCallback, useEffect } from 'react';
import { getSavedExpandedFolderIds, saveExpandedFolderIds } from '../lib/utils/folder-tree';

export function useExpandedFolders() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => getSavedExpandedFolderIds());

  useEffect(() => {
    saveExpandedFolderIds(expandedIds);
  }, [expandedIds]);

  const toggleExpand = useCallback((folderId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const expandFolder = useCallback((folderId: string) => {
    setExpandedIds((prev) => new Set(prev).add(folderId));
  }, []);

  const collapseFolder = useCallback((folderId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(folderId);
      return next;
    });
  }, []);

  const expandMultiple = useCallback((folderIds: string[]) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      folderIds.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  return {
    expandedIds,
    toggleExpand,
    expandFolder,
    collapseFolder,
    expandMultiple,
  };
}

export default useExpandedFolders;
