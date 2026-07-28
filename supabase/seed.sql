-- ============================================================================
-- ESFLOW AUTOMATED ADMIN INITIALIZATION SCRIPT
-- Sole System Owner: Eswar Chinthakayala
-- Email: eswarchinthakayala2004@gmail.com
-- Default Password: Admin@123
-- ============================================================================

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_email text := 'eswarchinthakayala2004@gmail.com';
  v_password text := 'Admin@123';
begin
  -- 1. Check if user already exists in auth.users
  select id into v_user_id from auth.users where email = v_email;

  -- 2. If not found, insert Admin user into auth.users directly
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
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Eswar Chinthakayala"}'::jsonb,
      now(),
      now()
    );
  end if;

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
