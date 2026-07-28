import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import type { ProjectSection, ProjectSectionUpdateInput } from '../../../types/project-section';
import { normalizeClientError } from '../../utils/client-errors';

/**
 * Enterprise Project Sections Data Access Layer (PHASE 07)
 * Single source of truth for modular markdown workspace documentation sections.
 * Pure data layer: ZERO mock data, ZERO SELECT * queries.
 */

const SECTION_COLUMNS = 'id, project_id, name, sort_order, content';

const DEFAULT_SECTION_NAMES = [
  'Overview',
  'Frontend',
  'Backend',
  'Database',
  'API',
  'Deployment',
];

function mapRowToSection(row: any): ProjectSection {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    name: String(row.name),
    sortOrder: Number(row.sort_order ?? 0),
    content: row.content !== null && row.content !== undefined ? String(row.content) : '',
  };
}

export async function fetchProjectSections(projectId: string): Promise<ProjectSection[]> {
  try {
    if (!projectId) return [];

    const { data, error } = await (supabase as any)
      .from('project_sections')
      .select(SECTION_COLUMNS)
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    const sections = (data || []).map(mapRowToSection);

    // If no sections exist yet for this project, auto-seed default sections in database
    if (sections.length === 0) {
      const defaultRows = DEFAULT_SECTION_NAMES.map((name, index) => ({
        project_id: projectId,
        name,
        sort_order: index,
        content: `# ${name}\n\nStart documenting ${name.toLowerCase()} architecture, contracts, or deployment steps here...`,
      }));

      const { data: seededData, error: seedError } = await (supabase as any)
        .from('project_sections')
        .insert(defaultRows)
        .select(SECTION_COLUMNS);

      if (!seedError && seededData) {
        return seededData.map(mapRowToSection);
      }
    }

    return sections;
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function fetchProjectSectionById(sectionId: string): Promise<ProjectSection> {
  try {
    const { data, error } = await (supabase as any)
      .from('project_sections')
      .select(SECTION_COLUMNS)
      .eq('id', sectionId)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToSection(data);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function updateProjectSectionRecord(
  sectionId: string,
  input: ProjectSectionUpdateInput
): Promise<ProjectSection> {
  try {
    const updatePayload: any = {};
    if (input.name !== undefined) updatePayload.name = input.name;
    if (input.content !== undefined) updatePayload.content = input.content;
    if (input.sortOrder !== undefined) updatePayload.sort_order = input.sortOrder;

    const { data, error } = await (supabase as any)
      .from('project_sections')
      .update(updatePayload)
      .eq('id', sectionId)
      .select(SECTION_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToSection(data);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function createProjectSectionRecord(
  projectId: string,
  name: string
): Promise<ProjectSection> {
  try {
    const { data, error } = await (supabase as any)
      .from('project_sections')
      .insert({
        project_id: projectId,
        name,
        sort_order: 99,
        content: `# ${name}\n\nStart documenting here...`,
      })
      .select(SECTION_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToSection(data);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

// --- Reusable React Query Hooks ---

export function useProjectSections(projectId?: string) {
  return useQuery<ProjectSection[], Error>({
    queryKey: ['project-sections', projectId],
    queryFn: () => {
      if (!projectId) return [];
      return fetchProjectSections(projectId);
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProjectSection(sectionId?: string) {
  return useQuery<ProjectSection, Error>({
    queryKey: ['project-section', sectionId],
    queryFn: () => {
      if (!sectionId) throw new Error('Section ID required');
      return fetchProjectSectionById(sectionId);
    },
    enabled: Boolean(sectionId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProjectSection() {
  const queryClient = useQueryClient();

  return useMutation<
    ProjectSection,
    Error,
    { sectionId: string; projectId: string; input: ProjectSectionUpdateInput }
  >({
    mutationFn: ({ sectionId, input }) => updateProjectSectionRecord(sectionId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['project-section', variables.sectionId], data);
      queryClient.invalidateQueries({ queryKey: ['project-sections', variables.projectId] });
    },
  });
}

export function useCreateProjectSection() {
  const queryClient = useQueryClient();

  return useMutation<ProjectSection, Error, { projectId: string; name: string }>({
    mutationFn: ({ projectId, name }) => createProjectSectionRecord(projectId, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-sections', variables.projectId] });
    },
  });
}
