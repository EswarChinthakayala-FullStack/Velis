-- ============================================================================
-- ESFLOW ADMIN SEED SCRIPT
-- Sole System Owner: Eswar Chinthakayala
-- Email: eswarchinthakayala2004@gmail.com
-- ============================================================================

-- Option A: If your Admin User is already created in Supabase Auth,
-- run this query to set Admin details for your Auth User ID:

insert into public.profiles (id, full_name, email, role, company, github_username)
select 
  id,
  'Eswar Chinthakayala',
  email,
  'admin',
  'EsFlow Systems',
  'EswarChinthakayala-FullStack'
from auth.users
where email = 'eswarchinthakayala2004@gmail.com'
on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  company = excluded.company,
  github_username = excluded.github_username;
