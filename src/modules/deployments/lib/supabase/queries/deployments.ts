import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../../../lib/supabase';
import type {
  DeploymentItem,
  CreateDeploymentInput,
  UpdateDeploymentInput,
  DeploymentEnvironment,
  DeploymentStatus,
  HealthStatus,
  DeploymentProvider,
} from '../../../types/deployment';

function mapRowToDeployment(row: any): DeploymentItem {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    environment: (row.environment as DeploymentEnvironment) || 'production',
    frontendUrl: row.frontend_url || undefined,
    backendUrl: row.backend_url || undefined,
    apiUrl: row.api_url || undefined,
    adminUrl: row.admin_url || undefined,
    portalUrl: row.portal_url || undefined,
    version: row.version || 'v1.0.0',
    branch: row.branch || 'main',
    commitSha: row.commit_sha || undefined,
    status: (row.status as DeploymentStatus) || 'active',
    healthStatus: (row.health_status as HealthStatus) || 'healthy',
    provider: (row.provider as DeploymentProvider) || 'vercel',
    deployedBy: row.deployed_by || undefined,
    durationSeconds: row.duration_seconds ? Number(row.duration_seconds) : undefined,
    notes: row.notes || undefined,
    deployedAt: row.deployed_at || row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.deployed_at || new Date().toISOString(),
  };
}

export async function fetchProjectDeployments(projectId?: string | null): Promise<DeploymentItem[]> {
  try {
    let query = (supabase as any)
      .from('deployments')
      .select(
        'id, project_id, environment, frontend_url, backend_url, api_url, admin_url, portal_url, version, branch, commit_sha, status, health_status, provider, deployed_by, duration_seconds, notes, deployed_at, updated_at'
      )
      .order('deployed_at', { ascending: false });

    if (projectId && projectId !== 'all') {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapRowToDeployment);
  } catch (err: any) {
    // Fallback if enhanced columns are missing in remote schema
    try {
      let fallbackQuery = (supabase as any)
        .from('deployments')
        .select('id, project_id, environment, frontend_url, backend_url, api_url, admin_url, portal_url, deployed_at')
        .order('deployed_at', { ascending: false });

      if (projectId && projectId !== 'all') {
        fallbackQuery = fallbackQuery.eq('project_id', projectId);
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      if (fallbackError) throw fallbackError;
      return (fallbackData || []).map(mapRowToDeployment);
    } catch (fallbackErr: any) {
      console.warn('Unable to load deployments from Supabase:', fallbackErr?.message || fallbackErr);
      return [];
    }
  }
}

export function useProjectDeployments(projectId?: string | null) {
  return useQuery({
    queryKey: ['project-deployments', projectId || 'all'],
    queryFn: () => fetchProjectDeployments(projectId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateDeploymentInput) => {
      try {
        const { data, error } = await (supabase as any)
          .from('deployments')
          .insert({
            project_id: input.projectId,
            environment: input.environment,
            frontend_url: input.frontendUrl || null,
            backend_url: input.backendUrl || null,
            api_url: input.apiUrl || null,
            admin_url: input.adminUrl || null,
            portal_url: input.portalUrl || null,
            version: input.version || 'v1.0.0',
            branch: input.branch || 'main',
            commit_sha: input.commitSha || null,
            status: input.status || 'active',
            health_status: input.healthStatus || 'healthy',
            provider: input.provider || 'vercel',
            notes: input.notes || null,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err: any) {
        // Fallback insert for core 0018_deployments columns
        const { data: fallbackData, error: fallbackError } = await (supabase as any)
          .from('deployments')
          .insert({
            project_id: input.projectId,
            environment: input.environment,
            frontend_url: input.frontendUrl || null,
            backend_url: input.backendUrl || null,
            api_url: input.apiUrl || null,
            admin_url: input.adminUrl || null,
            portal_url: input.portalUrl || null,
          })
          .select()
          .single();

        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-deployments'] });
    },
  });
}

export function useUpdateDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateDeploymentInput) => {
      try {
        const payload: any = {
          environment: input.environment,
          frontend_url: input.frontendUrl,
          backend_url: input.backendUrl,
          api_url: input.apiUrl,
          admin_url: input.adminUrl,
          portal_url: input.portalUrl,
          version: input.version,
          branch: input.branch,
          commit_sha: input.commitSha,
          status: input.status,
          health_status: input.healthStatus,
          provider: input.provider,
          notes: input.notes,
          updated_at: new Date().toISOString(),
        };
        Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

        const { data, error } = await (supabase as any)
          .from('deployments')
          .update(payload)
          .eq('id', input.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err: any) {
        const fallbackPayload: any = {
          environment: input.environment,
          frontend_url: input.frontendUrl,
          backend_url: input.backendUrl,
          api_url: input.apiUrl,
          admin_url: input.adminUrl,
          portal_url: input.portalUrl,
        };
        Object.keys(fallbackPayload).forEach((key) => fallbackPayload[key] === undefined && delete fallbackPayload[key]);

        const { data: fallbackData, error: fallbackError } = await (supabase as any)
          .from('deployments')
          .update(fallbackPayload)
          .eq('id', input.id)
          .select()
          .single();

        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-deployments'] });
    },
  });
}

export function useDeleteDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('deployments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-deployments'] });
    },
  });
}
