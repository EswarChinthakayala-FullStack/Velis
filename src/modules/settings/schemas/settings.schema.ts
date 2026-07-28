import { z } from 'zod';

export const generalSettingsSchema = z.object({
  appName: z.string().min(2, 'Application name is required'),
  appVersion: z.string().min(1, 'Version is required'),
  environment: z.string().min(1, 'Environment is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  dateFormat: z.string().min(1, 'Date format is required'),
  timeFormat: z.enum(['12h', '24h']),
  defaultCurrency: z.string().min(1, 'Default currency is required'),
  language: z.string().min(1, 'Language is required'),
  autoSave: z.boolean(),
  autoSaveInterval: z.number().min(5, 'Minimum interval is 5 seconds'),
  markdownPreviewMode: z.enum(['split', 'live', 'edit']),
});

export const profileSettingsSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().optional(),
  bio: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  githubUsername: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  preferredLanguage: z.string().optional(),
});

export const projectDefaultsSchema = z.object({
  defaultStatus: z.enum(['in_progress', 'review', 'completed', 'on_hold', 'planning']),
  defaultPriority: z.enum(['low', 'medium', 'high', 'urgent']),
  defaultVisibility: z.enum(['private', 'shareable']),
  defaultSort: z.enum(['created_at_desc', 'updated_at_desc', 'name_asc']),
  defaultCurrency: z.string().min(1, 'Currency is required'),
});

export const githubSettingsSchema = z.object({
  autoSync: z.boolean(),
  syncFrequency: z.string(),
  defaultBranch: z.string().min(1, 'Default branch is required'),
  syncIssues: z.boolean(),
});

export const sharePortalSettingsSchema = z.object({
  defaultExpirationDays: z.number().min(1).max(365),
  requirePassword: z.boolean(),
  allowDownloads: z.boolean(),
  allowAttachments: z.boolean(),
  showTimeline: z.boolean(),
  showChangelog: z.boolean(),
  showPayments: z.boolean(),
  showDeployments: z.boolean(),
  showDocs: z.boolean(),
  hideInternalSections: z.boolean(),
  sessionTimeoutMinutes: z.number().min(5).max(1440),
});

export const deploymentSettingsSchema = z.object({
  defaultEnvironment: z.string().min(1),
  defaultProvider: z.string().min(1),
  autoRefresh: z.boolean(),
  refreshIntervalSeconds: z.number().min(10).max(3600),
  healthCheckEnabled: z.boolean(),
  historyRetentionDays: z.number().min(1).max(365),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;
export type ProjectDefaultsFormValues = z.infer<typeof projectDefaultsSchema>;
export type GitHubSettingsFormValues = z.infer<typeof githubSettingsSchema>;
export type SharePortalSettingsFormValues = z.infer<typeof sharePortalSettingsSchema>;
export type DeploymentSettingsFormValues = z.infer<typeof deploymentSettingsSchema>;
