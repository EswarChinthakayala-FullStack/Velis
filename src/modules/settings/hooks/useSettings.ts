import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSettingKey,
  saveSettingKey,
  fetchProfileSettings,
  updateProfileSettings,
  fetchStorageSettings,
  fetchAPISettings,
} from '../lib/supabase/queries/settings';
import type {
  GeneralSettings,
  ProfileSettings,
  NotificationSettings,
  ProjectDefaultSettings,
  GitHubSettings,
  SharePortalSettings,
  DeploymentSettings,
  StorageSettings,
  APISettings,
  AppearanceSettings,
  SecuritySettings,
  BackupSettings,
} from '../types/settings';

const DEFAULT_GENERAL: GeneralSettings = {
  appName: 'EsFlow Studio',
  appVersion: 'v2.4.0',
  environment: 'production',
  timezone: 'UTC',
  dateFormat: 'MMM d, yyyy',
  timeFormat: '24h',
  defaultCurrency: 'USD',
  language: 'en',
  autoSave: true,
  autoSaveInterval: 30,
  markdownPreviewMode: 'split',
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  channels: { inApp: true, email: true, browser: true },
  events: {
    projectCreated: true,
    projectUpdated: true,
    projectArchived: false,
    deadlineChanged: true,
    clientAdded: true,
    timelineAdded: true,
    githubSynced: true,
    shareLinkCreated: true,
    shareLinkExpired: true,
    paymentAdded: true,
    paymentVerified: true,
    deploymentSuccess: true,
    deploymentFailed: true,
    noteReminder: true,
    releasePublished: true,
    systemWarning: true,
  },
};

const DEFAULT_PROJECT_DEFAULTS: ProjectDefaultSettings = {
  defaultStatus: 'in_progress',
  defaultPriority: 'medium',
  defaultVisibility: 'private',
  defaultSort: 'created_at_desc',
  defaultCurrency: 'USD',
};

const DEFAULT_GITHUB: GitHubSettings = {
  autoSync: true,
  syncFrequency: '15m',
  defaultBranch: 'main',
  syncIssues: true,
  orgName: '',
  isConnected: false,
};

const DEFAULT_SHARE_PORTAL: SharePortalSettings = {
  defaultExpirationDays: 30,
  requirePassword: true,
  allowDownloads: true,
  allowAttachments: true,
  showTimeline: true,
  showChangelog: true,
  showPayments: true,
  showDeployments: true,
  showDocs: true,
  hideInternalSections: true,
  sessionTimeoutMinutes: 60,
};

const DEFAULT_DEPLOYMENT: DeploymentSettings = {
  defaultEnvironment: 'production',
  defaultProvider: 'vercel',
  autoRefresh: true,
  refreshIntervalSeconds: 60,
  healthCheckEnabled: true,
  historyRetentionDays: 90,
};

const DEFAULT_APPEARANCE: AppearanceSettings = {
  accentColor: 'monochrome',
  compactMode: false,
  animationsEnabled: true,
  reducedMotion: false,
  glassIntensity: 'high',
  sidebarWidth: 'normal',
  theme: 'dark',
};

const DEFAULT_SECURITY: SecuritySettings = {
  twoFactorEnabled: false,
  sessionTimeoutMinutes: 120,
  jwtExpirationHours: 24,
  activeSessionsCount: 1,
};

const DEFAULT_BACKUP: BackupSettings = {
  autoBackupEnabled: true,
  backupFrequency: 'daily',
  retentionDays: 30,
};

export function useGeneralSettings() {
  return useQuery({
    queryKey: ['settings', 'general'],
    queryFn: () => fetchSettingKey<GeneralSettings>('general', DEFAULT_GENERAL),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProfileSettings() {
  return useQuery({
    queryKey: ['settings', 'profile'],
    queryFn: () => fetchProfileSettings(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ['settings', 'notifications'],
    queryFn: () => fetchSettingKey<NotificationSettings>('notifications', DEFAULT_NOTIFICATIONS),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProjectDefaultSettings() {
  return useQuery({
    queryKey: ['settings', 'project_defaults'],
    queryFn: () => fetchSettingKey<ProjectDefaultSettings>('project_defaults', DEFAULT_PROJECT_DEFAULTS),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGitHubSettings() {
  return useQuery({
    queryKey: ['settings', 'github'],
    queryFn: () => fetchSettingKey<GitHubSettings>('github', DEFAULT_GITHUB),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSharePortalSettings() {
  return useQuery({
    queryKey: ['settings', 'share_portal'],
    queryFn: () => fetchSettingKey<SharePortalSettings>('share_portal', DEFAULT_SHARE_PORTAL),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDeploymentSettings() {
  return useQuery({
    queryKey: ['settings', 'deployments'],
    queryFn: () => fetchSettingKey<DeploymentSettings>('deployments', DEFAULT_DEPLOYMENT),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAppearanceSettings() {
  return useQuery({
    queryKey: ['settings', 'appearance'],
    queryFn: () => fetchSettingKey<AppearanceSettings>('appearance', DEFAULT_APPEARANCE),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: ['settings', 'security'],
    queryFn: () => fetchSettingKey<SecuritySettings>('security', DEFAULT_SECURITY),
    staleTime: 1000 * 60 * 5,
  });
}

export function useBackupSettings() {
  return useQuery({
    queryKey: ['settings', 'backup'],
    queryFn: () => fetchSettingKey<BackupSettings>('backup', DEFAULT_BACKUP),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStorageSettings() {
  return useQuery({
    queryKey: ['settings', 'storage'],
    queryFn: () => fetchStorageSettings(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAPISettings() {
  return useQuery({
    queryKey: ['settings', 'api'],
    queryFn: () => fetchAPISettings(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSettingKey<T>() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: T }) => {
      return saveSettingKey<T>(key, value);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings', variables.key] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Partial<ProfileSettings>) => {
      return updateProfileSettings(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
    },
  });
}
