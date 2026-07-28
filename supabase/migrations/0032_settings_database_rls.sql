-- Migration 0032: Enterprise System Settings Schema & Public RLS Policy
-- Ensures settings are stored 100% in Supabase Database without localStorage dependency.

CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 1. Public SELECT Policy: Allow all users (including unauthenticated share portal viewers) to read settings
DROP POLICY IF EXISTS "settings_select_policy" ON public.settings;
CREATE POLICY "settings_select_policy" ON public.settings
    FOR SELECT
    USING (true);

-- 2. Authenticated ALL Policy: Allow logged-in users/admins to create, update, and manage settings
DROP POLICY IF EXISTS "settings_write_policy" ON public.settings;
CREATE POLICY "settings_write_policy" ON public.settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Seed default share_portal configuration into public.settings
INSERT INTO public.settings (key, value)
VALUES (
    'share_portal',
    '{
        "defaultExpirationDays": 30,
        "requirePassword": true,
        "allowDownloads": true,
        "allowAttachments": true,
        "showTimeline": true,
        "showChangelog": true,
        "showPayments": true,
        "showDeployments": true,
        "showDocs": true,
        "hideInternalSections": true,
        "sessionTimeoutMinutes": 60
    }'::jsonb
),
(
    'general',
    '{
        "appName": "Velis",
        "appVersion": "v2.4.0",
        "environment": "production",
        "timezone": "UTC",
        "dateFormat": "MMM d, yyyy",
        "timeFormat": "24h",
        "defaultCurrency": "USD",
        "language": "en",
        "autoSave": true,
        "autoSaveInterval": 30,
        "markdownPreviewMode": "split"
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
