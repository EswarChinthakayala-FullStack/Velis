-- ============================================================
-- 0031_enterprise_settings.sql
-- PHASE 16: Enterprise Settings & Configuration Center (Strict Admin-Only)
-- ============================================================

-- 1. Ensure settings key-value table exists and enhance schema
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Ensure profiles table has developer profile columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS company text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS github_username text,
ADD COLUMN IF NOT EXISTS country text DEFAULT 'United States',
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. ENABLE RLS: STRICT ADMIN ONLY (Zero Viewer Policy)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_settings_all" ON public.settings;
DROP POLICY IF EXISTS "viewer_read_settings" ON public.settings;

-- Admin Policy: Full CRUD for authenticated administrators
CREATE POLICY "admin_settings_all" ON public.settings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- CRITICAL SECURITY BOUNDARY: ABSOLUTELY NO VIEWER POLICY IS CREATED.
-- Settings MUST NEVER be readable or accessible by public share portal tokens or non-admin viewers.

-- 3. Seed Default Setting Category Records (If not exists)
INSERT INTO public.settings (key, value)
VALUES
  ('general', '{"appName": "Velis Studio", "appVersion": "v2.4.0", "environment": "production", "timezone": "UTC", "dateFormat": "MMM d, yyyy", "timeFormat": "24h", "defaultCurrency": "USD", "language": "en", "autoSave": true, "autoSaveInterval": 30, "markdownPreviewMode": "split"}'::jsonb),
  ('notifications', '{"channels": {"inApp": true, "email": true, "browser": true}, "events": {"projectCreated": true, "projectUpdated": true, "projectArchived": false, "deadlineChanged": true, "clientAdded": true, "timelineAdded": true, "githubSynced": true, "shareLinkCreated": true, "shareLinkExpired": true, "paymentAdded": true, "paymentVerified": true, "deploymentSuccess": true, "deploymentFailed": true, "noteReminder": true, "releasePublished": true, "systemWarning": true}}'::jsonb),
  ('project_defaults', '{"defaultStatus": "in_progress", "defaultPriority": "medium", "defaultVisibility": "private", "defaultSort": "created_at_desc", "defaultCurrency": "USD"}'::jsonb),
  ('github', '{"autoSync": true, "syncFrequency": "15m", "defaultBranch": "main", "syncIssues": true}'::jsonb),
  ('share_portal', '{"defaultExpirationDays": 30, "requirePassword": true, "allowDownloads": true, "allowAttachments": true, "showTimeline": true, "showChangelog": true, "showPayments": true, "showDeployments": true, "showDocs": true, "hideInternalSections": true, "sessionTimeoutMinutes": 60}'::jsonb),
  ('deployments', '{"defaultEnvironment": "production", "defaultProvider": "vercel", "autoRefresh": true, "refreshIntervalSeconds": 60, "healthCheckEnabled": true, "historyRetentionDays": 90}'::jsonb),
  ('appearance', '{"accentColor": "monochrome", "compactMode": false, "animationsEnabled": true, "reducedMotion": false, "glassIntensity": "high", "sidebarWidth": "normal", "theme": "dark"}'::jsonb),
  ('security', '{"twoFactorEnabled": false, "sessionTimeoutMinutes": 120, "jwtExpirationHours": 24}'::jsonb),
  ('backup', '{"autoBackupEnabled": true, "backupFrequency": "daily", "retentionDays": 30}'::jsonb)
ON CONFLICT (key) DO NOTHING;
