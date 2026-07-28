export type DocumentCategory =
  | 'Technical'
  | 'API'
  | 'Deployment'
  | 'Database'
  | 'User Guide'
  | 'Internal'
  | 'Client Visible';

export type DocumentStatus = 'draft' | 'review' | 'approved' | 'archived';

export interface DocumentAttachment {
  id: string;
  documentId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
}

export interface DocumentItem {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  content: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: string;
  author?: string;
  isClientVisible: boolean;
  sortOrder: number;
  tags?: string[];
  attachments?: DocumentAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersionItem {
  id: string;
  documentId: string;
  version: string;
  content: string;
  createdBy: string;
  createdAt: string;
  changeSummary?: string;
}

export interface CreateDocumentInput {
  projectId: string;
  title: string;
  content: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
  version?: string;
  author?: string;
  isClientVisible?: boolean;
  tags?: string[];
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
  version?: string;
  author?: string;
  isClientVisible?: boolean;
  sortOrder?: number;
  tags?: string[];
}

export interface TocHeadingItem {
  id: string;
  text: string;
  level: number;
}
