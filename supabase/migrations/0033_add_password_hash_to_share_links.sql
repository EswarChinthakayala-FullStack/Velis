-- ============================================================
-- 0033_add_password_hash_to_share_links.sql
-- Add the missing password_hash column that the application code
-- relies on for password-protected share links.
-- ============================================================

ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS password_hash text;
