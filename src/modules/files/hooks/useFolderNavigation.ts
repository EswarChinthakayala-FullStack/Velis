import { useState, useCallback } from 'react';
import type { FolderItem } from '../lib/types/file';

export interface BreadcrumbNode {
  id: string | null;
  name: string;
}

export function useFolderNavigation(initialFolderId: string | null = null) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(initialFolderId);
  const [folderHistory, setFolderHistory] = useState<BreadcrumbNode[]>([
    { id: null, name: 'Root' },
  ]);

  const navigateToFolder = useCallback((folder: FolderItem) => {
    setCurrentFolderId(folder.id);
    setFolderHistory((prev) => {
      // Check if folder is already in trail
      const existingIdx = prev.findIndex((node) => node.id === folder.id);
      if (existingIdx !== -1) {
        return prev.slice(0, existingIdx + 1);
      }
      return [...prev, { id: folder.id, name: folder.name }];
    });
  }, []);

  const navigateToBreadcrumb = useCallback((targetId: string | null) => {
    setCurrentFolderId(targetId);
    setFolderHistory((prev) => {
      const idx = prev.findIndex((node) => node.id === targetId);
      if (idx !== -1) {
        return prev.slice(0, idx + 1);
      }
      if (targetId === null) {
        return [{ id: null, name: 'Root' }];
      }
      return prev;
    });
  }, []);

  const resetToRoot = useCallback(() => {
    setCurrentFolderId(null);
    setFolderHistory([{ id: null, name: 'Root' }]);
  }, []);

  return {
    currentFolderId,
    folderHistory,
    navigateToFolder,
    navigateToBreadcrumb,
    resetToRoot,
  };
}
