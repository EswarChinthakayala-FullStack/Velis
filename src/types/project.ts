export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ProjectTechnology {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface ProjectGitHubRepo {
  id: string;
  repoUrl: string;
  organization?: string;
  branch?: string;
  visibility?: 'public' | 'private';
  openIssues?: number;
  openPrs?: number;
  lastSyncedAt?: string;
}

export interface ProjectItem {
  id: string;
  clientId?: string;
  clientName?: string;
  clientCompany?: string;
  name: string;
  slug: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string;
  deadline?: string;
  completionPercent: number;
  color?: string;
  thumbnailUrl?: string;
  technologies: ProjectTechnology[];
  githubRepo?: ProjectGitHubRepo;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectQueryFilter {
  search?: string;
  status?: ProjectStatus | 'all';
  priority?: ProjectPriority | 'all';
  clientId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'created_at' | 'updated_at' | 'name' | 'deadline' | 'completion_percent';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProjectsResult {
  projects: ProjectItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
