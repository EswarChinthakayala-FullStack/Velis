export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export interface ProjectSection {
  id: string;
  projectId: string;
  name: string;
  sortOrder: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectSectionUpdateInput {
  name?: string;
  content?: string;
  sortOrder?: number;
}
