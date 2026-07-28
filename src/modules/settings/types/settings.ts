export type SettingsSectionId =
  | 'general'
  | 'profile'
  | 'notifications'
  | 'project_defaults'
  | 'github'
  | 'share_portal'
  | 'deployments'
  | 'storage'
  | 'api'
  | 'appearance'
  | 'security'
  | 'backup'
  | 'danger';

export interface GeneralSettings {
  appName: string;
  appVersion: string;
  environment: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  defaultCurrency: string;
  language: string;
  autoSave: boolean;
  autoSaveInterval: number;
  markdownPreviewMode: 'split' | 'live' | 'edit';
}

export interface ProfileSettings {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  username?: string;
  bio?: string;
  company?: string;
  website?: string;
  githubUsername?: string;
  country?: string;
  timezone?: string;
  preferredLanguage?: string;
  role: string;
  createdAt: string;
}

export interface NotificationChannels {
  inApp: boolean;
  email: boolean;
  browser: boolean;
}

export interface NotificationEvents {
  projectCreated: boolean;
  projectUpdated: boolean;
  projectArchived: boolean;
  deadlineChanged: boolean;
  clientAdded: boolean;
  timelineAdded: boolean;
  githubSynced: boolean;
  shareLinkCreated: boolean;
  shareLinkExpired: boolean;
  paymentAdded: boolean;
  paymentVerified: boolean;
  deploymentSuccess: boolean;
  deploymentFailed: boolean;
  noteReminder: boolean;
  releasePublished: boolean;
  systemWarning: boolean;
}

export interface NotificationSettings {
  channels: NotificationChannels;
  events: NotificationEvents;
}

export interface ProjectDefaultSettings {
  defaultStatus: 'in_progress' | 'review' | 'completed' | 'on_hold' | 'planning';
  defaultPriority: 'low' | 'medium' | 'high' | 'urgent';
  defaultVisibility: 'private' | 'shareable';
  defaultSort: 'created_at_desc' | 'updated_at_desc' | 'name_asc';
  defaultCurrency: string;
}

export interface GitHubSettings {
  autoSync: boolean;
  syncFrequency: string;
  defaultBranch: string;
  syncIssues: boolean;
  orgName?: string;
  isConnected?: boolean;
}

export interface SharePortalSettings {
  defaultExpirationDays: number;
  requirePassword: boolean;
  allowDownloads: boolean;
  allowAttachments: boolean;
  showTimeline: boolean;
  showChangelog: boolean;
  showPayments: boolean;
  showDeployments: boolean;
  showDocs: boolean;
  hideInternalSections: boolean;
  sessionTimeoutMinutes: number;
}

export interface DeploymentSettings {
  defaultEnvironment: string;
  defaultProvider: string;
  autoRefresh: boolean;
  refreshIntervalSeconds: number;
  healthCheckEnabled: boolean;
  historyRetentionDays: number;
}

export interface StorageSettings {
  totalBytesUsed: number;
  projectFilesBytes: number;
  timelineFilesBytes: number;
  docFilesBytes: number;
  assetFilesBytes: number;
  invoiceFilesBytes: number;
  totalStorageLimitBytes: number;
}

export interface APISettings {
  supabaseStatus: 'operational' | 'degraded' | 'offline';
  edgeFunctionsStatus: 'operational' | 'degraded' | 'offline';
  realtimeStatus: 'operational' | 'degraded' | 'offline';
  storageStatus: 'operational' | 'degraded' | 'offline';
  databaseStatus: 'operational' | 'degraded' | 'offline';
  apiVersion: string;
  environmentVarsCount: number;
}

export interface AppearanceSettings {
  accentColor: 'monochrome' | 'zinc' | 'white';
  compactMode: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  glassIntensity: 'high' | 'medium' | 'low';
  sidebarWidth: 'normal' | 'compact';
  theme: 'dark' | 'system';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  jwtExpirationHours: number;
  lastLoginAt?: string;
  activeSessionsCount: number;
}

export interface BackupSettings {
  autoBackupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  lastBackupAt?: string;
}
