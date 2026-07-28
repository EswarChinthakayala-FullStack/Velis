export type ReleaseStatus = 'draft' | 'internal' | 'published' | 'archived';

export type ReleaseType = 'stable' | 'beta' | 'alpha' | 'hotfix' | 'major' | 'minor' | 'patch';

export interface ChangelogAttachment {
  id: string;
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
}

export interface ChangelogEntry {
  id: string;
  projectId: string;
  version: string;
  title: string;
  summary?: string;
  description?: string;
  releasedAt: string;
  releaseType: ReleaseType;
  status: ReleaseStatus;
  createdBy?: string;
  attachments?: ChangelogAttachment[];
  githubReleaseUrl?: string;
  environment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChangelogInput {
  projectId: string;
  version: string;
  title: string;
  summary?: string;
  description?: string;
  releasedAt?: string;
  releaseType?: ReleaseType;
  status?: ReleaseStatus;
  attachments?: ChangelogAttachment[];
  githubReleaseUrl?: string;
  environment?: string;
}

export interface UpdateChangelogInput extends Partial<CreateChangelogInput> {
  id: string;
}
