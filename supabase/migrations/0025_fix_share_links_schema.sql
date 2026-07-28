-- ============================================================
-- 0025_fix_share_links_schema.sql
-- Fix share_links table, projects columns, project_documents table,
-- portal RLS read policies, and public storage access.
-- ============================================================

-- 1. Add all potentially missing share_links columns
ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS token_hash text;
ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS token text;
ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS current_views integer NOT NULL DEFAULT 0;
ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS max_views integer;
ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS revoked_at timestamptz;
ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS last_accessed_at timestamptz;
ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 2. Sync token_hash ↔ token for any existing rows
UPDATE public.share_links SET token_hash = token WHERE token_hash IS NULL AND token IS NOT NULL;
UPDATE public.share_links SET token = token_hash WHERE token IS NULL AND token_hash IS NOT NULL;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_share_links_token_hash ON public.share_links(token_hash);
CREATE INDEX IF NOT EXISTS idx_share_links_token ON public.share_links(token);
CREATE INDEX IF NOT EXISTS idx_share_links_project_id ON public.share_links(project_id);
CREATE INDEX IF NOT EXISTS idx_share_links_expires_at ON public.share_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_share_links_is_active ON public.share_links(is_active);

-- 4. Enable RLS on share_links
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;

-- 5. Admin full access on share_links
DROP POLICY IF EXISTS "admin_share_links_all" ON public.share_links;
CREATE POLICY "admin_share_links_all" ON public.share_links
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 6. Public read access on share_links (token is the secret)
DROP POLICY IF EXISTS "public_read_share_links" ON public.share_links;
CREATE POLICY "public_read_share_links" ON public.share_links
  FOR SELECT USING (true);

-- 7. Public update for view count analytics
DROP POLICY IF EXISTS "public_update_share_links_views" ON public.share_links;
CREATE POLICY "public_update_share_links_views" ON public.share_links
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================
-- 8. Create project_documents table if it doesn't exist
-- Prevents 404 Not Found errors when documentation queries project_documents
-- ============================================================
CREATE TABLE IF NOT EXISTS public.project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text,
  content text,
  category text DEFAULT 'Technical',
  status text DEFAULT 'approved',
  version text DEFAULT '1.0.0',
  author text DEFAULT 'System Lead',
  is_client_visible boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_project_documents_all" ON public.project_documents;
CREATE POLICY "admin_project_documents_all" ON public.project_documents
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "portal_read_shared_project_documents" ON public.project_documents;
CREATE POLICY "portal_read_shared_project_documents" ON public.project_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = project_documents.project_id
        AND sl.is_active = true
    )
  );

-- ============================================================
-- 9. Portal RLS: Allow public read-only access to project data
-- ONLY for projects that have an active share link.
-- ============================================================

-- Projects: public read for shared projects
DROP POLICY IF EXISTS "portal_read_shared_projects" ON public.projects;
CREATE POLICY "portal_read_shared_projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = projects.id
        AND sl.is_active = true
    )
  );

-- Milestones: public read for shared projects
DROP POLICY IF EXISTS "portal_read_shared_milestones" ON public.milestones;
CREATE POLICY "portal_read_shared_milestones" ON public.milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = milestones.project_id
        AND sl.is_active = true
    )
  );

-- Project Updates: public read for shared projects
DROP POLICY IF EXISTS "portal_read_shared_updates" ON public.project_updates;
CREATE POLICY "portal_read_shared_updates" ON public.project_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = project_updates.project_id
        AND sl.is_active = true
    )
  );

-- Files: public read for shared projects
DROP POLICY IF EXISTS "portal_read_shared_files" ON public.files;
CREATE POLICY "portal_read_shared_files" ON public.files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = files.project_id
        AND sl.is_active = true
    )
  );

-- Project Sections: public read for shared projects
DROP POLICY IF EXISTS "portal_read_shared_project_sections" ON public.project_sections;
CREATE POLICY "portal_read_shared_project_sections" ON public.project_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = project_sections.project_id
        AND sl.is_active = true
    )
  );

-- Documents: public read for shared projects
DROP POLICY IF EXISTS "portal_read_shared_documents" ON public.documents;
CREATE POLICY "portal_read_shared_documents" ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = documents.project_id
        AND sl.is_active = true
    )
  );

-- Tasks: public read for shared projects
DROP POLICY IF EXISTS "portal_read_shared_tasks" ON public.tasks;
CREATE POLICY "portal_read_shared_tasks" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = tasks.project_id
        AND sl.is_active = true
    )
  );

-- Folders: public read for shared projects
DROP POLICY IF EXISTS "portal_read_shared_folders" ON public.folders;
CREATE POLICY "portal_read_shared_folders" ON public.folders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = folders.project_id
        AND sl.is_active = true
    )
  );

-- Screenshots: public read for shared projects
DROP POLICY IF EXISTS "portal_read_shared_screenshots" ON public.screenshots;
CREATE POLICY "portal_read_shared_screenshots" ON public.screenshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = screenshots.project_id
        AND sl.is_active = true
    )
  );

-- ============================================================
-- 10. Supabase Storage Buckets & Objects RLS Policy
-- Ensure storage buckets exist and are marked public,
-- and allow public SELECT on storage.objects for uploaded files.
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('project-assets', 'project-assets', true),
  ('assets', 'assets', true),
  ('documents', 'documents', true),
  ('public', 'public', true),
  ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "public_read_storage_objects" ON storage.objects;
CREATE POLICY "public_read_storage_objects" ON storage.objects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "authenticated_storage_objects_all" ON storage.objects;
CREATE POLICY "authenticated_storage_objects_all" ON storage.objects
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
