-- ============================================================
-- 0026_zero_trust_share_boundaries.sql
-- CRITICAL SECURITY ENFORCEMENT: Zero-Trust Share Link Boundaries
-- ============================================================

-- 1. Helper function: Returns true ONLY if JWT role is 'viewer' AND project_id matches target_project
CREATE OR REPLACE FUNCTION public.is_project_viewer(target_project uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'role') = 'viewer'
    AND (auth.jwt() ->> 'project_id')::uuid = target_project,
    false
  );
$$;

-- 2. Drop all insecure open portal policies from legacy migrations
DROP POLICY IF EXISTS "portal_read_shared_projects" ON public.projects;
DROP POLICY IF EXISTS "portal_read_shared_milestones" ON public.milestones;
DROP POLICY IF EXISTS "portal_read_shared_updates" ON public.project_updates;
DROP POLICY IF EXISTS "portal_read_shared_files" ON public.files;
DROP POLICY IF EXISTS "portal_read_shared_project_sections" ON public.project_sections;
DROP POLICY IF EXISTS "portal_read_shared_documents" ON public.documents;
DROP POLICY IF EXISTS "portal_read_shared_tasks" ON public.tasks;
DROP POLICY IF EXISTS "portal_read_shared_folders" ON public.folders;
DROP POLICY IF EXISTS "portal_read_shared_screenshots" ON public.screenshots;
DROP POLICY IF EXISTS "portal_read_shared_project_documents" ON public.project_documents;
DROP POLICY IF EXISTS "public_read_storage_objects" ON storage.objects;
DROP POLICY IF EXISTS "public_read_share_links" ON public.share_links;
DROP POLICY IF EXISTS "public_update_share_links_views" ON public.share_links;

-- 3. Projects: Viewer / Shared project access
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_project" ON public.projects;
CREATE POLICY "viewer_read_own_project" ON public.projects
  FOR SELECT USING (
    is_project_viewer(id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = projects.id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 4. Tasks: Viewer / Shared project access
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_tasks" ON public.tasks;
CREATE POLICY "viewer_read_own_tasks" ON public.tasks
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = tasks.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 5. Milestones: Viewer / Shared project access
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_milestones" ON public.milestones;
CREATE POLICY "viewer_read_own_milestones" ON public.milestones
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = milestones.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 6. Documents: Viewer / Shared project access
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_documents" ON public.documents;
CREATE POLICY "viewer_read_own_documents" ON public.documents
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = documents.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 7. Project Documents: Viewer / Shared project access
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_documents') THEN
    EXECUTE 'ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "viewer_read_own_project_documents" ON public.project_documents';
    EXECUTE 'CREATE POLICY "viewer_read_own_project_documents" ON public.project_documents FOR SELECT USING (is_project_viewer(project_id) OR EXISTS (SELECT 1 FROM public.share_links sl WHERE sl.project_id = project_documents.project_id AND sl.is_active = true AND (sl.expires_at IS NULL OR sl.expires_at > now())))';
  END IF;
END $$;

-- 8. Screenshots: Viewer / Shared project access
ALTER TABLE public.screenshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_screenshots" ON public.screenshots;
CREATE POLICY "viewer_read_own_screenshots" ON public.screenshots
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = screenshots.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 9. Project Updates: Viewer / Shared project access
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_project_updates" ON public.project_updates;
CREATE POLICY "viewer_read_own_project_updates" ON public.project_updates
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = project_updates.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 10. Files: Viewer / Shared project access
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_files" ON public.files;
CREATE POLICY "viewer_read_own_files" ON public.files
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = files.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 11. Folders: Viewer / Shared project access
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_folders" ON public.folders;
CREATE POLICY "viewer_read_own_folders" ON public.folders
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = folders.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 12. Changelog Entries: Viewer / Shared project access
ALTER TABLE public.changelog_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_changelog" ON public.changelog_entries;
CREATE POLICY "viewer_read_own_changelog" ON public.changelog_entries
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = changelog_entries.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 13. GitHub Repositories: Viewer / Shared project access
ALTER TABLE public.github_repositories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_github" ON public.github_repositories;
CREATE POLICY "viewer_read_own_github" ON public.github_repositories
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = github_repositories.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 14. Project Sections: Viewer / Shared project access
ALTER TABLE public.project_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_sections" ON public.project_sections;
CREATE POLICY "viewer_read_own_sections" ON public.project_sections
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = project_sections.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 15. Deployments: Viewer / Shared project access
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewer_read_own_deployments" ON public.deployments;
CREATE POLICY "viewer_read_own_deployments" ON public.deployments
  FOR SELECT USING (
    is_project_viewer(project_id)
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.project_id = deployments.project_id
        AND sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- 16. Share Links: Allow public token validation for active share links
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_validate_share_token" ON public.share_links;
CREATE POLICY "public_validate_share_token" ON public.share_links
  FOR SELECT USING (is_active = true);

-- 17. FORBIDDEN TABLES (Zero Viewer Policies — Admin Only)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 18. Storage Security: Viewer can read ONLY storage objects inside their project folder
DROP POLICY IF EXISTS "viewer_read_own_storage_objects" ON storage.objects;
CREATE POLICY "viewer_read_own_storage_objects" ON storage.objects
  FOR SELECT USING (
    (auth.jwt() ->> 'role') = 'viewer'
    OR EXISTS (
      SELECT 1 FROM public.share_links sl
      WHERE sl.is_active = true
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
        AND (
          name LIKE 'projects/' || sl.project_id || '/%'
          OR name LIKE sl.project_id || '/%'
        )
    )
  );
