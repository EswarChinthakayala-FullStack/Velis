-- ===================================================
-- VELIS ENTERPRISE SEED DATA (PROD RELEASE v1.1)
-- Sole System Admin / Owner: Eswar Chinthakayala
-- Email: eswarchinthakayala2004@gmail.com | Phone: 7674940870
-- Default Password: Admin@123
-- ===================================================
--
-- IMPORTANT: Do NOT manually insert into auth.users!
-- Supabase Auth GoTrue requires matching auth.identities records.
-- The admin user should be created via the Supabase Auth API (signup)
-- or via the Supabase Dashboard → Authentication → Users → Add User.
--
-- This seed only pre-creates the public.profiles row.
-- The handle_new_user() trigger will upsert it when the user signs up.
-- ===================================================

-- 1. Pre-create the admin profile (will be upserted by trigger on first signup)
insert into public.profiles (id, full_name, email, avatar_url, role, created_at)
values (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Eswar Chinthakayala',
  'eswarchinthakayala2004@gmail.com',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'owner',
  now()
)
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role;
