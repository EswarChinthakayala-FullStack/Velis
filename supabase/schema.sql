-- ============================================================================
-- ESFLOW ENTERPRISE DATABASE SCHEMA (PRODUCTION RELEASE v2.0)
-- Streamlined for essential platform navigation pages & high performance.
-- ============================================================================

-- 0. CLEANUP EXISTING TABLES (IDEMPOTENT RESET)
drop table if exists public.delivery_assets cascade;
drop table if exists public.project_payments cascade;
drop table if exists public.activity_logs cascade;
drop table if exists public.settings cascade;
drop table if exists public.changelog_entries cascade;
drop table if exists public.share_links cascade;
drop table if exists public.project_documents cascade;
drop table if exists public.documents cascade;
drop table if exists public.milestones cascade;
drop table if exists public.task_attachments cascade;
drop table if exists public.tasks cascade;
drop table if exists public.github_repositories cascade;
drop table if exists public.project_technologies cascade;
drop table if exists public.projects cascade;
drop table if exists public.clients cascade;
drop table if exists public.profiles cascade;

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

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
  create type repo_visibility as enum ('public','private');
exception when duplicate_object then null; end $$;

-- 3. PROFILES TABLE (Dashboard & Telemetry)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  username text,
  company text,
  github_username text,
  role text not null default 'admin' check (role in ('admin','owner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz default now()
);

-- 4. CLIENTS TABLE (Client Directory)
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. PROJECTS TABLE (Timelines & Roadmap)
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

-- 7. GITHUB REPOSITORIES TABLE (GitHub Repositories)
create table if not exists public.github_repositories (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  repo_url text not null,
  organization text,
  branch text default 'main',
  visibility repo_visibility default 'private',
  open_issues integer default 0,
  open_prs integer default 0,
  last_synced_at timestamptz default now(),
  created_at timestamptz not null default now()
);

-- 8. TASKS & TASK ATTACHMENTS (Tasks & Kanban)
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
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_attachments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

-- 9. MILESTONES TABLE (Milestones & Roadmap)
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending','in_progress','completed')),
  due_date date,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

-- 10. DOCUMENTS TABLE (Documentation & Specs)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  content text,
  category text default 'specification',
  is_public boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  file_url text not null,
  file_size text,
  created_at timestamptz not null default now()
);

-- 11. SHARE LINKS TABLE (Share Links & Access)
create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  token text,
  token_hash text,
  name text default 'Client Share Portal',
  access_level text default 'full_access',
  password_hash text,
  is_active boolean not null default true,
  current_views integer not null default 0,
  max_views integer,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 12. CHANGELOG ENTRIES TABLE (Changelog & Releases)
create table if not exists public.changelog_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  version text not null,
  title text,
  summary text,
  description text,
  release_type text default 'stable',
  created_at timestamptz not null default now()
);

-- 13. PROJECT PAYMENTS TABLE (Revenue & Billing / Payments & Delivery)
create table if not exists public.project_payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending','verified','failed')),
  payment_method text default 'bank_transfer',
  transaction_id text,
  receipt_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  file_url text not null,
  unlock_type text not null default 'immediate',
  is_manual_unlocked boolean not null default false,
  created_at timestamptz not null default now()
);

-- 14. TELEMETRY & ACTIVITY LOGS (Developer Telemetry)
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 15. PERFORMANCE INDEXES ON FOREIGN KEYS
create index if not exists idx_clients_created_by on public.clients(created_by);
create index if not exists idx_projects_client_id on public.projects(client_id);
create index if not exists idx_projects_created_by on public.projects(created_by);
create index if not exists idx_project_tech_project_id on public.project_technologies(project_id);
create index if not exists idx_github_repos_project_id on public.github_repositories(project_id);
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_task_attachments_task_id on public.task_attachments(task_id);
create index if not exists idx_milestones_project_id on public.milestones(project_id);
create index if not exists idx_documents_project_id on public.documents(project_id);
create index if not exists idx_share_links_project_id on public.share_links(project_id);
create index if not exists idx_changelog_entries_project_id on public.changelog_entries(project_id);
create index if not exists idx_project_payments_project_id on public.project_payments(project_id);
create index if not exists idx_delivery_assets_project_id on public.delivery_assets(project_id);
create index if not exists idx_activity_logs_actor_id on public.activity_logs(actor_id);

-- 16. SECURITY & HELPER FUNCTIONS
create or replace function public.is_admin()
returns boolean
language sql security definer stable
as $$
  select auth.uid() is not null;
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

-- RPC Function for Dashboard Overview Telemetry
create or replace function public.get_dashboard_kpis()
returns json
language plpgsql
security definer
as $$
declare
  v_active_projects bigint;
  v_completed_projects bigint;
  v_total_clients bigint;
  v_pending_tasks bigint;
  v_total_revenue numeric;
  v_result json;
begin
  select count(*) into v_active_projects from public.projects where status = 'active';
  select count(*) into v_completed_projects from public.projects where status = 'completed';
  select count(*) into v_total_clients from public.clients;
  select count(*) into v_pending_tasks from public.tasks where status != 'completed';
  select coalesce(sum(amount), 0) into v_total_revenue from public.project_payments where is_verified = true;

  v_result := json_build_object(
    'activeProjects', coalesce(v_active_projects, 0),
    'completedProjects', coalesce(v_completed_projects, 0),
    'totalClients', coalesce(v_total_clients, 0),
    'pendingTasks', coalesce(v_pending_tasks, 0),
    'totalRevenue', coalesce(v_total_revenue, 0)
  );

  return v_result;
end;
$$;

-- 17. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_technologies enable row level security;
alter table public.github_repositories enable row level security;
alter table public.tasks enable row level security;
alter table public.task_attachments enable row level security;
alter table public.milestones enable row level security;
alter table public.documents enable row level security;
alter table public.project_documents enable row level security;
alter table public.share_links enable row level security;
alter table public.changelog_entries enable row level security;
alter table public.settings enable row level security;
alter table public.activity_logs enable row level security;
alter table public.project_payments enable row level security;
alter table public.delivery_assets enable row level security;

-- 18. RLS POLICIES
create policy "admin_profiles_all" on public.profiles for all using (is_admin()) with check (is_admin());
create policy "admin_clients_all" on public.clients for all using (is_admin()) with check (is_admin());
create policy "admin_projects_all" on public.projects for all using (is_admin()) with check (is_admin());
create policy "admin_project_tech_all" on public.project_technologies for all using (is_admin()) with check (is_admin());
create policy "admin_github_repos_all" on public.github_repositories for all using (is_admin()) with check (is_admin());
create policy "admin_tasks_all" on public.tasks for all using (is_admin()) with check (is_admin());
create policy "admin_milestones_all" on public.milestones for all using (is_admin()) with check (is_admin());
create policy "admin_documents_all" on public.documents for all using (is_admin()) with check (is_admin());
create policy "admin_project_documents_all" on public.project_documents for all using (is_admin()) with check (is_admin());
create policy "admin_share_links_all" on public.share_links for all using (is_admin()) with check (is_admin());
create policy "admin_changelog_all" on public.changelog_entries for all using (is_admin()) with check (is_admin());
create policy "admin_settings_all" on public.settings for all using (is_admin()) with check (is_admin());
create policy "admin_activity_logs_all" on public.activity_logs for all using (is_admin()) with check (is_admin());
create policy "admin_payments_all" on public.project_payments for all using (is_admin()) with check (is_admin());
create policy "admin_delivery_assets_all" on public.delivery_assets for all using (is_admin()) with check (is_admin());

create policy "public_read_share_links" on public.share_links for select using (true);
create policy "portal_read_shared_projects" on public.projects for select using (
  exists (select 1 from public.share_links sl where sl.project_id = projects.id and sl.is_active = true)
);

-- 19. PROFILE SYNCHRONIZATION TRIGGER
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

-- 20. REALTIME SUBSCRIPTIONS
do $$ begin alter publication supabase_realtime add table public.projects; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.tasks; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.activity_logs; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.milestones; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.documents; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.github_repositories; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.changelog_entries; exception when others then null; end $$;

-- 21. AUTOMATED ADMIN USER & PROFILE INITIALIZATION
do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_email text := 'eswarchinthakayala2004@gmail.com';
  v_password text := 'Admin@123';
  v_encrypted_password text := extensions.crypt('Admin@123', extensions.gen_salt('bf'));
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      email_change_token_current,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      v_email,
      v_encrypted_password,
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Eswar Chinthakayala"}'::jsonb,
      false,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at,
      provider_id
    ) values (
      v_user_id,
      v_user_id,
      format('{"sub":"%s","email":"%s"}', v_user_id, v_email)::jsonb,
      'email',
      now(),
      now(),
      now(),
      v_email
    );
  end if;

  insert into public.profiles (id, full_name, email, role, company, github_username)
  values (
    v_user_id,
    'Eswar Chinthakayala',
    v_email,
    'admin',
    'EsFlow Systems',
    'EswarChinthakayala-FullStack'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role,
    company = excluded.company,
    github_username = excluded.github_username;
end $$;
