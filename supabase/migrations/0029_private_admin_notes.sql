-- ============================================================
-- 0029_private_admin_notes.sql
-- PHASE 15: Private Admin Notes Workspace (Strict Admin-Only)
-- ============================================================

-- 1. Ensure notes table exists and enhance columns
CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Note',
  content text NOT NULL DEFAULT '',
  category text DEFAULT 'general',
  is_pinned boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  tags text[] DEFAULT '{}'::text[],
  attachments jsonb DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add optional columns if missing & drop strict NOT NULL on created_by
ALTER TABLE public.notes
ALTER COLUMN created_by DROP NOT NULL,
ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT 'Untitled Note',
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. Indexes for fast filtering and search
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON public.notes(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_client_id ON public.notes(client_id);
CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON public.notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_is_archived ON public.notes(is_archived);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);

-- 3. ENABLE RLS: STRICT ZERO-TRUST ADMIN ONLY
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "admin_notes_all" ON public.notes;
DROP POLICY IF EXISTS "viewer_read_notes" ON public.notes;

-- Admin Policy: Full CRUD for authenticated administrators
CREATE POLICY "admin_notes_all" ON public.notes
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- CRITICAL SECURITY RULE: ABSOLUTELY NO POLICY CREATED FOR VIEWERS.
-- Public/Viewers/Share Links will be rejected automatically by RLS.
