export type ShareLinkStatus = 'active' | 'expired' | 'disabled' | 'protected';

export interface ShareLinkItem {
  id: string;
  projectId: string;
  token: string;
  tokenHash?: string;
  passwordHash?: string | null;
  hasPassword?: boolean;
  expiresAt: string | null;
  isActive: boolean;
  maxViews?: number | null;
  currentViews: number;
  revokedAt?: string | null;
  lastAccessedAt?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShareLinkStats {
  activeCount: number;
  expiredCount: number;
  disabledCount: number;
  totalViews: number;
  lastAccessedAt: string | null;
  passwordProtectedCount: number;
}

export type ExpirationOption = 'never' | '1d' | '7d' | '30d' | '90d' | 'custom';

export interface GenerateShareLinkInput {
  projectId: string;
  expirationPreset: ExpirationOption;
  customExpirationDate?: string | null;
  hasPassword?: boolean;
  password?: string | null;
  notes?: string | null;
}

export interface UpdateShareLinkSettingsInput {
  linkId: string;
  expirationPreset?: ExpirationOption;
  customExpirationDate?: string | null;
  hasPassword?: boolean;
  password?: string | null;
  isActive?: boolean;
  notes?: string | null;
}

export interface ShareLinkFilterOptions {
  searchQuery: string;
  statusFilter: 'all' | 'active' | 'expired' | 'disabled' | 'protected';
  sortBy: 'created_at' | 'expires_at' | 'current_views' | 'last_accessed_at';
  sortOrder: 'asc' | 'desc';
}
