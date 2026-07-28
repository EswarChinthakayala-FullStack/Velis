-- ============================================================
-- 0030_deployment_enhancements.sql
-- PHASE 15: Deployments & Environment Management Enhancements
-- ============================================================

-- Add optional deployment metadata columns if missing
ALTER TABLE public.deployments
ADD COLUMN IF NOT EXISTS version text DEFAULT 'v1.0.0',
ADD COLUMN IF NOT EXISTS branch text DEFAULT 'main',
ADD COLUMN IF NOT EXISTS commit_sha text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS health_status text DEFAULT 'healthy',
ADD COLUMN IF NOT EXISTS provider text DEFAULT 'vercel',
ADD COLUMN IF NOT EXISTS deployed_by text,
ADD COLUMN IF NOT EXISTS duration_seconds integer,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_environment ON public.deployments(environment);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON public.deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_deployed_at ON public.deployments(deployed_at DESC);

-- Enable RLS
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

-- Admin Policy: Full CRUD for authenticated admins
DROP POLICY IF EXISTS "admin_deployments_all" ON public.deployments;
CREATE POLICY "admin_deployments_all" ON public.deployments
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Viewer Policy: Read-only access restricted strictly to their assigned project
DROP POLICY IF EXISTS "viewer_read_own_deployments" ON public.deployments;
CREATE POLICY "viewer_read_own_deployments" ON public.deployments
  FOR SELECT USING (is_project_viewer(project_id));
