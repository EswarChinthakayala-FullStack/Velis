export interface GenerateShareLinkRequest {
  projectId: string;
  expiresAt?: string | null;
  password?: string | null;
  notes?: string | null;
  maxViews?: number | null;
}

export interface GenerateShareLinkResponse {
  success: boolean;
  shareUrl: string;
  token: string;
  id: string;
  expiresAt: string | null;
  passwordProtected: boolean;
  createdAt: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}
