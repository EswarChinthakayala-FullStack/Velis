-- Helper: is the current JWT an authenticated admin?
create or replace function public.is_admin()
returns boolean
language sql security definer stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

-- Helper: does the current JWT carry a valid viewer scope for :project_id?
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

-- Enable RLS and Policies across all core tables
alter table public.projects enable row level security;
create policy "admin_full_access" on public.projects
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_project" on public.projects
  for select using (is_project_viewer(id));

alter table public.clients enable row level security;
create policy "admin_full_access" on public.clients
  for all using (is_admin()) with check (is_admin());

alter table public.tasks enable row level security;
create policy "admin_full_access" on public.tasks
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_tasks" on public.tasks
  for select using (is_project_viewer(project_id));

alter table public.milestones enable row level security;
create policy "admin_full_access" on public.milestones
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_milestones" on public.milestones
  for select using (is_project_viewer(project_id));

alter table public.documents enable row level security;
create policy "admin_full_access" on public.documents
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_documents" on public.documents
  for select using (is_project_viewer(project_id));

alter table public.files enable row level security;
create policy "admin_full_access" on public.files
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_files" on public.files
  for select using (is_project_viewer(project_id));

alter table public.screenshots enable row level security;
create policy "admin_full_access" on public.screenshots
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_screenshots" on public.screenshots
  for select using (is_project_viewer(project_id));

alter table public.changelog_entries enable row level security;
create policy "admin_full_access" on public.changelog_entries
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_changelog" on public.changelog_entries
  for select using (is_project_viewer(project_id));

alter table public.github_repositories enable row level security;
create policy "admin_full_access" on public.github_repositories
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_github" on public.github_repositories
  for select using (is_project_viewer(project_id));

alter table public.project_updates enable row level security;
create policy "admin_full_access" on public.project_updates
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_project_updates" on public.project_updates
  for select using (is_project_viewer(project_id));

alter table public.project_sections enable row level security;
create policy "admin_full_access" on public.project_sections
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_project_sections" on public.project_sections
  for select using (is_project_viewer(project_id));

alter table public.deployments enable row level security;
create policy "admin_full_access" on public.deployments
  for all using (is_admin()) with check (is_admin());
create policy "viewer_read_own_deployments" on public.deployments
  for select using (is_project_viewer(project_id));

-- Notes are never exposed to viewers — admin-only, no viewer policy exists:
alter table public.notes enable row level security;
create policy "admin_full_access" on public.notes
  for all using (is_admin()) with check (is_admin());
