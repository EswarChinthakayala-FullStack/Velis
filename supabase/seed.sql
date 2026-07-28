-- ============================================================================
-- ESFLOW AUTOMATED ADMIN INITIALIZATION SCRIPT
-- Sole System Owner: Eswar Chinthakayala
-- Email: eswarchinthakayala2004@gmail.com
-- Default Password: Admin@123
-- ============================================================================

-- Clean reset any incomplete auth user
delete from auth.users where email = 'eswarchinthakayala2004@gmail.com';

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_email text := 'eswarchinthakayala2004@gmail.com';
  v_password text := 'Admin@123';
  v_encrypted_password text := crypt('Admin@123', gen_salt('bf'));
begin
  -- 1. Insert valid GoTrue user into auth.users (omitting generated confirmed_at column)
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

  -- 2. Insert corresponding identity into auth.identities
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

  -- 3. Create or update Admin Profile in public.profiles
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
