-- ==========================================================
-- 0024_enterprise_share_links.sql
-- Enterprise Share Links Table with Cryptographic Hashing & RLS
-- ==========================================================

create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  token_hash text not null unique,
  password_hash text,
  expires_at timestamptz,
  is_active boolean not null default true,
  max_views integer,
  current_views integer not null default 0,
  revoked_at timestamptz,
  last_accessed_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Performance & Security Indexes
create index if not exists idx_share_links_token_hash on public.share_links(token_hash);
create index if not exists idx_share_links_project_id on public.share_links(project_id);
create index if not exists idx_share_links_expires_at on public.share_links(expires_at);
create index if not exists idx_share_links_is_active on public.share_links(is_active);

-- Enable Row Level Security (Admin Access Only)
alter table public.share_links enable row level security;

drop policy if exists "admin_share_links_all" on public.share_links;
create policy "admin_share_links_all" on public.share_links
  for all using (is_admin()) with check (is_admin());
