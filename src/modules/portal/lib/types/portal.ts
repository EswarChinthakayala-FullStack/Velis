export type PortalAuthState =
  | 'idle'
  | 'validating'
  | 'password_required'
  | 'invalid_password'
  | 'valid'
  | 'expired'
  | 'revoked'
  | 'disabled'
  | 'invalid'
  | 'view_limit_exceeded'
  | 'error';

export interface ValidateTokenResult {
  success: boolean;
  status: PortalAuthState;
  accessToken?: string;
  expiresIn?: number;
  projectId?: string;
  error?: string;
}

export interface PortalProject {
  id: string;
  name: string;
  clientName?: string | null;
  description?: string | null;
  status?: string | null;
  progress?: number;
  budget?: number | null;
  spent?: number | null;
  dueDate?: string | null;
  githubRepo?: string | null;
  priority?: 'high' | 'medium' | 'low';
  createdAt?: string;
}

export interface PortalMilestone {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: 'completed' | 'in_progress' | 'upcoming';
  dueDate?: string | null;
  progressPercentage?: number;
}

export interface PortalTimelineEvent {
  id: string;
  projectId: string;
  title: string;
  content?: string | null;
  type: string;
  createdAt: string;
}

export interface PortalFile {
  id: string;
  projectId: string;
  name: string;
  size: number;
  mimeType?: string | null;
  publicUrl?: string | null;
  storagePath?: string | null;
  updatedAt: string;
}

export interface PortalSessionContextType {
  viewerJwt: string | null;
  projectId: string | null;
  viewerClient: any | null;
  project: PortalProject | null;
  isLoadingProject: boolean;
  clearSession: () => void;
}
