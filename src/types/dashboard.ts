export interface DashboardKpiCounts {
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  upcomingDeadlines: number;
  overdueTasks: number;
  activeClients: number;
  githubRepositories: number;
}

export interface ProjectProgress {
  id: string;
  name: string;
  completionPercent: number;
  color: string;
}

export interface MonthlyCompletion {
  month: string;
  completedCount: number;
}

export interface TechnologyUsage {
  name: string;
  count: number;
}

export interface ClientDistribution {
  clientName: string;
  projectCount: number;
}

export interface RecentActivityItem {
  id: string;
  actorId?: string;
  actorName: string;
  actorAvatar?: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityName: string;
  projectName?: string;
  createdAt: string;
}

export interface DashboardQueryError {
  message: string;
  code?: string;
}
