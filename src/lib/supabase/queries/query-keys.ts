export const fileKeys = {
  all: ['files'] as const,
  lists: () => [...fileKeys.all, 'list'] as const,
  list: (projectId?: string | null, folderId?: string | null) =>
    [...fileKeys.lists(), projectId || 'all', folderId || 'root'] as const,
  details: () => [...fileKeys.all, 'detail'] as const,
  detail: (id: string) => [...fileKeys.details(), id] as const,
};

export const folderKeys = {
  all: ['folders'] as const,
  trees: () => [...folderKeys.all, 'tree'] as const,
  tree: (projectId?: string | null) => [...folderKeys.trees(), projectId || 'all'] as const,
  children: (projectId?: string | null, parentId?: string | null) =>
    [...folderKeys.all, 'children', projectId || 'all', parentId || 'root'] as const,
};

export const screenshotKeys = {
  all: ['screenshots'] as const,
  lists: () => [...screenshotKeys.all, 'list'] as const,
  list: (projectId?: string | null) => [...screenshotKeys.lists(), projectId || 'all'] as const,
  detail: (id: string) => [...screenshotKeys.all, 'detail', id] as const,
};
