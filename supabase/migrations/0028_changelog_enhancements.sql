-- ============================================================
-- 0028_changelog_enhancements.sql
-- PHASE 15: Changelog Module Enterprise Extensions & Security
-- ============================================================

-- 1. Ensure changelog_entries table exists and enhance columns
CREATE TABLE IF NOT EXISTS public.changelog_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version text NOT NULL,
  title text,
  description text,
  released_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add optional enterprise fields if missing
ALTER TABLE public.changelog_entries
ADD COLUMN IF NOT EXISTS summary text,
ADD COLUMN IF NOT EXISTS release_type text DEFAULT 'stable',
ADD COLUMN IF NOT EXISTS status text DEFAULT 'published',
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS github_release_url text,
ADD COLUMN IF NOT EXISTS environment text DEFAULT 'production';

-- 2. Indexes for fast sorting and version lookups
CREATE INDEX IF NOT EXISTS idx_changelog_entries_project_id ON public.changelog_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_changelog_entries_released_at ON public.changelog_entries(released_at DESC);
CREATE INDEX IF NOT EXISTS idx_changelog_entries_status ON public.changelog_entries(status);

-- 3. Enable RLS
ALTER TABLE public.changelog_entries ENABLE ROW LEVEL SECURITY;

-- Admin Policy: Full CRUD for admins
DROP POLICY IF EXISTS "admin_changelog_all" ON public.changelog_entries;
CREATE POLICY "admin_changelog_all" ON public.changelog_entries
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Viewer / Client Share Link Policy: Read ONLY published entries belonging to shared project
DROP POLICY IF EXISTS "viewer_read_published_changelog" ON public.changelog_entries;
CREATE POLICY "viewer_read_published_changelog" ON public.changelog_entries
  FOR SELECT USING (
    status = 'published'
    AND (
      is_project_viewer(project_id)
      OR EXISTS (
        SELECT 1 FROM public.share_links sl
        WHERE sl.project_id = changelog_entries.project_id
          AND sl.is_active = true
          AND (sl.expires_at IS NULL OR sl.expires_at > now())
      )
    )
  );
