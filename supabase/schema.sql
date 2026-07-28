-- ============================================================================
-- VELIS ENTERPRISE DATABASE SCHEMA (PRODUCTION RELEASE v1.0)
-- Optimized for New Supabase Projects (SQL Editor One-Click Execution)
-- ============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. CUSTOM ENUMS
do $$ begin
  create type project_status as enum ('planning','active','on_hold','completed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_priority as enum ('low','medium','high','urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_status as enum ('todo','in_progress','review','testing','completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type deployment_environment as enum ('local','development','staging','production');
exception when duplicate_object then null; end $$;

do $$ begin
  create type repo_visibility as enum ('public','private');
exception when duplicate_object then null; end $$;

-- 3. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  username text,
  bio text,
  company text,
  website text,
  github_username text,
  country text default 'United States',
  timezone text default 'UTC',
  preferred_language text default 'en',
  role text not null default 'admin' check (role in ('admin','owner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz default now()
);

-- 4. CLIENTS TABLE
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles(id) on delete set null,
  name text not null,
  company text,
  email text,
  phone text,
  country text,
  timezone text,
  website text,
  notes text,
  github_username text,
  social_links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. PROJECTS TABLE
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  status project_status not null default 'planning',
  priority project_priority not null default 'medium',
  start_date date,
  deadline date,
  completion_percent smallint not null default 0 check (completion_percent between 0 and 100),
  color text default '#E11D48',
  thumbnail_url text,
  budget numeric(12,2) default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. PROJECT TECHNOLOGIES TABLE
create table if not exists public.project_technologies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  icon_url text
);

-- 7. PROJECT SECTIONS TABLE
create table if not exists public.project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  sort_order smallint not null default 0,
  content text
);

-- 8. GITHUB REPOSITORIES TABLE
create table if not exists public.github_repositories (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  repo_url text not null,
  organization text,
  branch text default 'main',
  visibility repo_visibility default 'private',
  latest_version text,
  latest_release text,
  open_issues integer default 0,
  open_prs integer default 0,
  last_synced_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. PROJECT UPDATES TABLE
create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  content text,
  entry_date date default current_date,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. TASKS TABLE
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  module text,
  priority project_priority not null default 'medium',
  status task_status not null default 'todo',
  due_date date,
  progress smallint default 0 check (progress between 0 and 100),
  labels text[] default '{}'::text[],
  sort_order smallint default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 11. TASK ATTACHMENTS TABLE
create table if not exists public.task_attachments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

-- 12. MILESTONES TABLE
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  name text not null default 'Untitled Milestone',
  title text,
  description text,
  notes text,
  status text default 'in_progress',
  due_date date,
  completion_date timestamptz,
  progress smallint default 0 check (progress between 0 and 100),
  target_completion_percent smallint default 100,
  sort_order smallint default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 12b. MILESTONE ATTACHMENTS TABLE
create table if not exists public.milestone_attachments (
  id uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.milestones(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

-- 13. DOCUMENTS & PROJECT DOCUMENTS TABLES
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  content text,
  category text default 'architecture',
  version text default '1.0.0',
  status text default 'draft',
  sort_order smallint default 0,
  is_archived boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  slug text,
  content text,
  category text default 'Technical',
  status text default 'approved',
  version text default '1.0.0',
  author text default 'System Lead',
  is_client_visible boolean not null default true,
  sort_order integer default 0,
  tags text[] default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 14. FOLDERS & FILES TABLES
create table if not exists public.folders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  parent_id uuid references public.folders(id) on delete cascade,
  name text not null,
  color text default '#64748B',
  is_protected boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  name text not null,
  file_url text not null default '',
  storage_path text,
  file_size bigint not null default 0,
  size_bytes bigint not null default 0,
  mime_type text,
  created_at timestamptz not null default now(),
  uploaded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 15. SCREENSHOTS TABLE
create table if not exists public.screenshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  title text not null,
  image_url text not null,
  caption text,
  sort_order smallint default 0,
  created_at timestamptz not null default now()
);

-- 16. SHARE LINKS TABLE
create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  token text,
  token_hash text,
  name text default 'Client Share Portal',
  access_level text default 'full_access',
  pin_code_hash text,
  passkey_hash text,
  password_hash text,
  allowed_ip_cidrs text[] default '{}'::text[],
  is_active boolean not null default true,
  current_views integer not null default 0,
  view_count integer not null default 0,
  max_views integer,
  expires_at timestamptz,
  revoked_at timestamptz,
  last_accessed_at timestamptz,
  notes text,
  scope_json jsonb not null default '{"allow_downloads":true,"allow_comments":false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 17. CHANGELOG ENTRIES TABLE
create table if not exists public.changelog_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  version text not null,
  title text,
  summary text,
  description text,
  release_type text default 'stable',
  status text default 'published',
  attachments jsonb default '[]'::jsonb,
  github_release_url text,
  environment text default 'production',
  released_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 18. NOTES TABLE
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null default 'Untitled Note',
  content text not null default '',
  category text default 'general',
  is_pinned boolean default false,
  is_archived boolean default false,
  tags text[] default '{}'::text[],
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 19. DEPLOYMENTS TABLE
create table if not exists public.deployments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  environment deployment_environment not null default 'production',
  version text default 'v1.0.0',
  branch text default 'main',
  commit_sha text,
  status text default 'active',
  health_status text default 'healthy',
  provider text default 'vercel',
  deployed_by text,
  duration_seconds integer,
  notes text,
  deployed_at timestamptz not null default now(),
  updated_at timestamptz default now()
);

-- 20. SETTINGS, TAGS, ACTIVITY LOGS TABLES
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text default '#64748B'
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- 21. PROJECT PAYMENTS & DELIVERY ASSETS TABLES
create table if not exists public.project_payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'INR',
  payment_method text not null default 'Bank Transfer',
  transaction_id text,
  payment_date timestamptz not null default now(),
  is_verified boolean not null default true,
  notes text,
  invoice_url text,
  receipt_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  asset_type text not null default 'google_drive',
  asset_url text not null,
  storage_path text,
  unlock_type text not null default '100_percent',
  is_manual_unlocked boolean not null default false,
  is_archived boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 21. GET DASHBOARD KPIS RPC FUNCTION
create or replace function public.get_dashboard_kpis()
returns jsonb
language sql security definer stable
as $$
  select jsonb_build_object(
    'total_projects', (select count(*) from public.projects),
    'active_projects', (select count(*) from public.projects where status = 'active'),
    'completed_projects', (select count(*) from public.projects where status = 'completed'),
    'on_hold_projects', (select count(*) from public.projects where status = 'on_hold'),
    'overdue_tasks', (select count(*) from public.tasks where due_date < current_date and status != 'completed'),
    'upcoming_deadlines', (select count(*) from public.milestones where due_date between current_date and (current_date + interval '7 days')),
    'active_clients', (select count(*) from public.clients),
    'repository_count', (select count(*) from public.github_repositories),
    'active_share_links', (select count(*) from public.share_links where is_active = true)
  );
$$;

-- 22. PERFORMANCE INDEXES
create index if not exists idx_share_links_token_hash on public.share_links(token_hash);
create index if not exists idx_share_links_project_id on public.share_links(project_id);
create index if not exists idx_project_payments_project_id on public.project_payments(project_id);
create index if not exists idx_delivery_assets_project_id on public.delivery_assets(project_id);
create index if not exists idx_changelog_entries_project_id on public.changelog_entries(project_id);
create index if not exists idx_notes_project_id on public.notes(project_id);
create index if not exists idx_deployments_project_id on public.deployments(project_id);
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_milestones_project_id on public.milestones(project_id);

-- 23. SECURITY & CALCULATION HELPER FUNCTIONS
create or replace function public.is_admin()
returns boolean
language sql security definer stable
as $$
  select auth.uid() is not null;
$$;

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

create or replace function public.get_project_paid_amount(p_project_id uuid)
returns numeric
language sql security definer stable
as $$
  select coalesce(sum(amount), 0)
  from public.project_payments
  where project_id = p_project_id
    and is_verified = true;
$$;

create or replace function public.is_asset_unlocked(
  p_unlock_type text,
  p_is_manual_unlocked boolean,
  p_project_id uuid
)
returns boolean
language plpgsql security definer stable
as $$
declare
  v_budget numeric := 0;
  v_paid numeric := 0;
  v_ratio numeric := 0;
begin
  if p_unlock_type = 'immediate' then return true; end if;
  if p_unlock_type = 'manual' then return coalesce(p_is_manual_unlocked, false); end if;
  select coalesce(budget, 0) into v_budget from public.projects where id = p_project_id;
  v_paid := public.get_project_paid_amount(p_project_id);
  if v_budget <= 0 then return v_paid > 0; end if;
  v_ratio := (v_paid / v_budget) * 100;
  if p_unlock_type = '25_percent' then return v_ratio >= 25;
  elsif p_unlock_type = '50_percent' then return v_ratio >= 50;
  elsif p_unlock_type = '75_percent' then return v_ratio >= 75;
  elsif p_unlock_type = '100_percent' then return v_ratio >= 100;
  end if;
  return false;
end;
$$;

-- 24. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_technologies enable row level security;
alter table public.project_sections enable row level security;
alter table public.github_repositories enable row level security;
alter table public.project_updates enable row level security;
alter table public.tasks enable row level security;
alter table public.task_attachments enable row level security;
alter table public.milestones enable row level security;
alter table public.documents enable row level security;
alter table public.project_documents enable row level security;
alter table public.folders enable row level security;
alter table public.files enable row level security;
alter table public.screenshots enable row level security;
alter table public.share_links enable row level security;
alter table public.changelog_entries enable row level security;
alter table public.notes enable row level security;
alter table public.deployments enable row level security;
alter table public.settings enable row level security;
alter table public.tags enable row level security;
alter table public.activity_logs enable row level security;
alter table public.project_payments enable row level security;
alter table public.delivery_assets enable row level security;

-- 25. RLS POLICIES (Idempotent: drop if exists before create)
drop policy if exists "admin_profiles_all" on public.profiles;
create policy "admin_profiles_all" on public.profiles for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_clients_all" on public.clients;
create policy "admin_clients_all" on public.clients for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_projects_all" on public.projects;
create policy "admin_projects_all" on public.projects for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_project_tech_all" on public.project_technologies;
create policy "admin_project_tech_all" on public.project_technologies for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_project_sec_all" on public.project_sections;
create policy "admin_project_sec_all" on public.project_sections for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_github_repos_all" on public.github_repositories;
create policy "admin_github_repos_all" on public.github_repositories for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_project_updates_all" on public.project_updates;
create policy "admin_project_updates_all" on public.project_updates for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_tasks_all" on public.tasks;
create policy "admin_tasks_all" on public.tasks for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_milestones_all" on public.milestones;
create policy "admin_milestones_all" on public.milestones for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_documents_all" on public.documents;
create policy "admin_documents_all" on public.documents for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_project_documents_all" on public.project_documents;
create policy "admin_project_documents_all" on public.project_documents for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_folders_all" on public.folders;
create policy "admin_folders_all" on public.folders for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_files_all" on public.files;
create policy "admin_files_all" on public.files for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_screenshots_all" on public.screenshots;
create policy "admin_screenshots_all" on public.screenshots for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_share_links_all" on public.share_links;
create policy "admin_share_links_all" on public.share_links for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_changelog_all" on public.changelog_entries;
create policy "admin_changelog_all" on public.changelog_entries for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_notes_all" on public.notes;
create policy "admin_notes_all" on public.notes for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_deployments_all" on public.deployments;
create policy "admin_deployments_all" on public.deployments for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_settings_all" on public.settings;
create policy "admin_settings_all" on public.settings for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_tags_all" on public.tags;
create policy "admin_tags_all" on public.tags for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_activity_logs_all" on public.activity_logs;
create policy "admin_activity_logs_all" on public.activity_logs for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_payments_all" on public.project_payments;
create policy "admin_payments_all" on public.project_payments for all using (is_admin()) with check (is_admin());

drop policy if exists "admin_delivery_assets_all" on public.delivery_assets;
create policy "admin_delivery_assets_all" on public.delivery_assets for all using (is_admin()) with check (is_admin());

-- Public / Share Portal policies
drop policy if exists "public_read_share_links" on public.share_links;
create policy "public_read_share_links" on public.share_links for select using (true);

drop policy if exists "public_update_share_links_views" on public.share_links;
create policy "public_update_share_links_views" on public.share_links for update using (true) with check (true);

drop policy if exists "portal_read_shared_projects" on public.projects;
create policy "portal_read_shared_projects" on public.projects for select using (
  exists (select 1 from public.share_links sl where sl.project_id = projects.id and sl.is_active = true)
);

-- 26. AUTOMATED TRIGGERS & PROFILE SYNCHRONIZATION
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at before update on public.clients for each row execute function public.handle_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at before update on public.projects for each row execute function public.handle_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at before update on public.tasks for each row execute function public.handle_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at before update on public.documents for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    'admin'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    avatar_url = excluded.avatar_url;
  return new;
exception when others then
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- 27. SUPABASE REALTIME SUBSCRIPTIONS
do $$ begin alter publication supabase_realtime add table public.projects; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.tasks; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.activity_logs; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.project_updates; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.milestones; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.documents; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.notes; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.deployments; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.github_repositories; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.changelog_entries; exception when others then null; end $$;
