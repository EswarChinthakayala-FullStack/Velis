import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import type {
  ClientRecord,
  ClientQueryFilter,
  PaginatedClientsResult,
  ClientProject,
  ClientStats,
} from '../../../types/client';
import type { ClientFormValues } from '../../validators/client-schema';
import { mapSupabaseRowToClient, mapSupabaseRowToProject } from '../../utils/client-mappers';
import { normalizeClientError } from '../../utils/client-errors';

/**
 * Enterprise Clients Data Access Layer (PHASE 06)
 * Single source of truth for all client CRUD operations.
 * Pure data layer: ZERO mock data, ZERO SELECT * queries, ZERO raw errors exposed.
 */

// Explicit column selections (NO SELECT *)
const CLIENT_COLUMNS = 'id, name, company, email, phone, country, timezone, website, notes, github_username, social_links, created_at, updated_at, projects(id, status)';
const CLIENT_SINGLE_COLUMNS = 'id, name, company, email, phone, country, timezone, website, notes, github_username, social_links, created_at, updated_at';
const PROJECT_COLUMNS = 'id, name, slug, description, status, priority, completion_percent, color, start_date, deadline, updated_at';

// --- Direct Database Access Functions ---

export async function fetchClients(
  filter: ClientQueryFilter = {}
): Promise<PaginatedClientsResult> {
  try {
    const {
      search = '',
      status = 'all',
      page = 1,
      pageSize = 20,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = filter;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = (supabase as any)
      .from('clients')
      .select(CLIENT_COLUMNS, { count: 'exact' });

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`name.ilike.${term},company.ilike.${term},email.ilike.${term}`);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    const rawClients = data || [];
    const totalCount = count ?? rawClients.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    const clients: ClientRecord[] = rawClients.map(mapSupabaseRowToClient);
    const filteredClients =
      status === 'all' ? clients : clients.filter((c) => c.status === status);

    return {
      clients: filteredClients,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function fetchClientById(clientId: string): Promise<ClientRecord> {
  try {
    const { data, error } = await (supabase as any)
      .from('clients')
      .select(CLIENT_COLUMNS)
      .eq('id', clientId)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapSupabaseRowToClient(data);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function fetchClientProjects(clientId: string): Promise<ClientProject[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('projects')
      .select(PROJECT_COLUMNS)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return (data || []).map(mapSupabaseRowToProject);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function fetchClientStats(clientId: string): Promise<ClientStats> {
  try {
    const { data, error } = await (supabase as any)
      .from('projects')
      .select('status')
      .eq('client_id', clientId);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    const projects = data || [];
    const totalProjects = projects.length;
    const activeProjects = projects.filter(
      (p: any) => p.status === 'active' || p.status === 'in_progress'
    ).length;
    const completedProjects = projects.filter((p: any) => p.status === 'completed').length;
    const onHoldProjects = projects.filter((p: any) => p.status === 'on_hold').length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      onHoldProjects,
    };
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function createClientRecord(input: ClientFormValues): Promise<ClientRecord> {
  try {
    let userId: string | undefined;

    try {
      const { data: userRes } = await supabase.auth.getUser();
      userId = userRes?.user?.id;
    } catch {
      // Ignore auth error, fallback to profile query
    }

    if (!userId) {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id')
        .limit(1)
        .maybeSingle();
      userId = profile?.id;
    }

    if (!userId) {
      throw new Error('Authentication required to create a client');
    }

    const { data, error } = await (supabase as any)
      .from('clients')
      .insert({
        created_by: userId,
        name: input.name,
        company: input.company || null,
        email: input.email || null,
        phone: input.phone || null,
        country: input.country || null,
        timezone: input.timezone || null,
        website: input.website || null,
        notes: input.notes || null,
        github_username: input.githubUsername || null,
        social_links: input.socialLinks || {},
      })
      .select(CLIENT_SINGLE_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapSupabaseRowToClient(data);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function updateClientRecord(
  clientId: string,
  input: ClientFormValues
): Promise<ClientRecord> {
  try {
    const { data, error } = await (supabase as any)
      .from('clients')
      .update({
        name: input.name,
        company: input.company || null,
        email: input.email || null,
        phone: input.phone || null,
        country: input.country || null,
        timezone: input.timezone || null,
        website: input.website || null,
        notes: input.notes || null,
        github_username: input.githubUsername || null,
        social_links: input.socialLinks || {},
        updated_at: new Date().toISOString(),
      })
      .eq('id', clientId)
      .select(CLIENT_SINGLE_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapSupabaseRowToClient(data);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function deleteClientRecord(clientId: string): Promise<void> {
  try {
    const { error } = await (supabase as any)
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

// --- Reusable React Query Hooks ---

export function useClients(filter: ClientQueryFilter = {}) {
  return useQuery<PaginatedClientsResult, Error>({
    queryKey: ['clients', filter],
    queryFn: () => fetchClients(filter),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export function useClient(id?: string) {
  return useQuery<ClientRecord, Error>({
    queryKey: ['client-details', id],
    queryFn: () => {
      if (!id) throw new Error('Client ID is required');
      return fetchClientById(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 3,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation<ClientRecord, Error, ClientFormValues>({
    mutationFn: (input) => createClientRecord(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-active-clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation<ClientRecord, Error, { id: string; values: ClientFormValues }>({
    mutationFn: ({ id, values }) => updateClientRecord(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-details', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteClientRecord(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-details', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
    },
  });
}
