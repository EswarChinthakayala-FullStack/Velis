export type FileCategory =
  | 'all'
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'document'
  | 'code'
  | 'archive'
  | 'other';

export type FileViewMode = 'grid' | 'list';

export type FileSortField = 'name' | 'updated_at' | 'size' | 'mime_type';
export type SortOrder = 'asc' | 'desc';

export interface FileItem {
  id: string;
  projectId?: string | null;
  folderId?: string | null;
  name: string;
  originalName: string;
  storagePath: string;
  mimeType: string;
  size: number;
  publicUrl?: string | null;
  signedUrl?: string | null;
  uploadedBy?: string | null;
  uploadedByAvatar?: string | null;
  checksum?: string | null;
  isClientVisible?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FolderItem {
  id: string;
  projectId?: string | null;
  parentId?: string | null;
  name: string;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadTask {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number; // 0 to 100
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'canceled';
  error?: string;
  speedBps?: number;
  uploadedBytes?: number;
}

export interface FileFilterState {
  searchQuery: string;
  category: FileCategory;
  sortField: FileSortField;
  sortOrder: SortOrder;
}
