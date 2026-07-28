-- ==========================================
-- 1. Automated updated_at Timestamp Trigger
-- ==========================================
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

-- Apply updated_at trigger to relevant tables
drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at
  before update on public.clients
  for each row execute function public.handle_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute function public.handle_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
  before update on public.documents
  for each row execute function public.handle_updated_at();

-- ==========================================
-- 2. Auth User Profile Auto-Creation Trigger
-- ==========================================
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
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==========================================
-- 3. Enable Supabase Realtime Subscriptions
-- ==========================================
begin;
  -- Add tables to the supabase_realtime publication
  alter publication supabase_realtime add table public.projects;
  alter publication supabase_realtime add table public.tasks;
  alter publication supabase_realtime add table public.activity_logs;
  alter publication supabase_realtime add table public.project_updates;
  alter publication supabase_realtime add table public.milestones;
  alter publication supabase_realtime add table public.documents;
  alter publication supabase_realtime add table public.notes;
  alter publication supabase_realtime add table public.deployments;
  alter publication supabase_realtime add table public.github_repositories;
  alter publication supabase_realtime add table public.changelog_entries;
commit;
