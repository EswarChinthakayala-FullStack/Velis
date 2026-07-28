export interface TechnologyItem {
  id: string;
  projectId?: string;
  name: string;
  iconUrl?: string;
  version?: string;
  usageCount?: number;
}

export interface TechnologySearchFilter {
  query?: string;
  limit?: number;
}

export interface AddTechnologyInput {
  projectId: string;
  name: string;
  iconUrl?: string;
}
