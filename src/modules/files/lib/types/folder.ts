export interface FolderTreeNode {
  id: string;
  projectId?: string | null;
  parentId?: string | null;
  name: string;
  depth: number;
  itemCount?: number;
  children?: FolderTreeNode[];
  createdAt: string;
  updatedAt: string;
}

export interface FolderNodeState {
  isExpanded: boolean;
  isSelected: boolean;
  isEditing: boolean;
  isLoadingChildren: boolean;
}

export type FolderContextMenuAction =
  | 'new_folder'
  | 'rename'
  | 'delete'
  | 'refresh'
  | 'copy_path';

export interface CreateSubfolderPayload {
  name: string;
  projectId?: string | null;
  parentId?: string | null;
}

export interface RenameFolderPayload {
  folderId: string;
  newName: string;
}
