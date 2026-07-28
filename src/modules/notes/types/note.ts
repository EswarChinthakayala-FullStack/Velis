export type NoteCategory =
  | 'general'
  | 'meeting'
  | 'client_pref'
  | 'ideas'
  | 'bugs'
  | 'improvements'
  | 'architecture'
  | 'deployment'
  | 'credentials'
  | 'followup'
  | 'internal_tasks'
  | 'research';

export interface NoteAttachment {
  id: string;
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
}

export interface NoteItem {
  id: string;
  projectId?: string;
  clientId?: string;
  title: string;
  content: string;
  category: NoteCategory;
  isPinned: boolean;
  isArchived: boolean;
  tags: string[];
  attachments?: NoteAttachment[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  projectId?: string;
  clientId?: string;
  title: string;
  content: string;
  category?: NoteCategory;
  isPinned?: boolean;
  isArchived?: boolean;
  tags?: string[];
  attachments?: NoteAttachment[];
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
  id: string;
}
