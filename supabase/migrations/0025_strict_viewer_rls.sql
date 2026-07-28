-- ==========================================================
-- 0025_strict_viewer_rls.sql
-- Zero-Trust PostgreSQL Row-Level Security Policies for Viewer Role
-- ==========================================================

-- Helper: Verifies viewer role and exact project_id match in JWT claims
create or replace function public.is_project_viewer(target_project uuid)
returns boolean
language sql security definer stable
as $$
  select coalesce(
    (auth.jwt() ->> 'role') = 'viewer'
    and (auth.jwt() ->> 'project_id')::uuid = target_project,
    false
  );
$$;

-- Projects: Viewer can read ONLY their assigned project
drop policy if exists "viewer_read_own_project" on public.projects;
create policy "viewer_read_own_project" on public.projects
  for select using (is_project_viewer(id));

-- Tasks: Viewer can read ONLY tasks belonging to their assigned project
drop policy if exists "viewer_read_own_tasks" on public.tasks;
create policy "viewer_read_own_tasks" on public.tasks
  for select using (is_project_viewer(project_id));

-- Milestones: Viewer can read ONLY milestones belonging to their assigned project
drop policy if exists "viewer_read_own_milestones" on public.milestones;
create policy "viewer_read_own_milestones" on public.milestones
  for select using (is_project_viewer(project_id));

-- Documents: Viewer can read ONLY documents belonging to their assigned project
drop policy if exists "viewer_read_own_documents" on public.documents;
create policy "viewer_read_own_documents" on public.documents
  for select using (is_project_viewer(project_id));

-- Screenshots: Viewer can read ONLY screenshots belonging to their assigned project
drop policy if exists "viewer_read_own_screenshots" on public.screenshots;
create policy "viewer_read_own_screenshots" on public.screenshots
  for select using (is_project_viewer(project_id));

-- Project Updates: Viewer can read ONLY updates belonging to their assigned project
drop policy if exists "viewer_read_own_project_updates" on public.project_updates;
create policy "viewer_read_own_project_updates" on public.project_updates
  for select using (is_project_viewer(project_id));

-- Files: Viewer can read ONLY files belonging to their assigned project
drop policy if exists "viewer_read_own_files" on public.files;
create policy "viewer_read_own_files" on public.files
  for select using (is_project_viewer(project_id));

-- Changelog Entries: Viewer can read ONLY changelogs belonging to their assigned project
drop policy if exists "viewer_read_own_changelog" on public.changelog_entries;
create policy "viewer_read_own_changelog" on public.changelog_entries
  for select using (is_project_viewer(project_id));

-- GitHub Repositories: Viewer can read ONLY repositories belonging to their assigned project
drop policy if exists "viewer_read_own_github" on public.github_repositories;
create policy "viewer_read_own_github" on public.github_repositories
  for select using (is_project_viewer(project_id));

-- Project Sections: Viewer can read ONLY sections belonging to their assigned project
drop policy if exists "viewer_read_own_sections" on public.project_sections;
create policy "viewer_read_own_sections" on public.project_sections
  for select using (is_project_viewer(project_id));

-- Deployments: Viewer can read ONLY deployments belonging to their assigned project
drop policy if exists "viewer_read_own_deployments" on public.deployments;
create policy "viewer_read_own_deployments" on public.deployments
  for select using (is_project_viewer(project_id));

-- Admin Notes: ZERO viewer policy (Admin Access Only)
alter table public.notes enable row level security;
drop policy if exists "viewer_no_access_notes" on public.notes;

-- Activity Logs: ZERO viewer policy (Admin Access Only)
alter table public.activity_logs enable row level security;
drop policy if exists "admin_activity_logs_all" on public.activity_logs;
create policy "admin_activity_logs_all" on public.activity_logs
  for all using (is_admin()) with check (is_admin());

-- Settings: ZERO viewer policy (Admin Access Only)
alter table public.settings enable row level security;
drop policy if exists "admin_settings_all" on public.settings;
create policy "admin_settings_all" on public.settings
  for all using (is_admin()) with check (is_admin());

-- Profiles: ZERO viewer policy (Admin Access Only)
alter table public.profiles enable row level security;
drop policy if exists "admin_profiles_all" on public.profiles;
create policy "admin_profiles_all" on public.profiles
  for all using (is_admin()) with check (is_admin());
