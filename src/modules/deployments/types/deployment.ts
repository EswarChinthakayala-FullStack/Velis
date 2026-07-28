export type DeploymentEnvironment =
  | 'local'
  | 'development'
  | 'qa'
  | 'staging'
  | 'production'
  | 'preview';

export type DeploymentStatus =
  | 'active'
  | 'offline'
  | 'maintenance'
  | 'deprecated'
  | 'archived';

export type HealthStatus = 'healthy' | 'warning' | 'offline' | 'unknown';

export type DeploymentProvider =
  | 'vercel'
  | 'netlify'
  | 'railway'
  | 'render'
  | 'aws'
  | 'fly'
  | 'custom';

export interface DeploymentItem {
  id: string;
  projectId: string;
  environment: DeploymentEnvironment;
  frontendUrl?: string;
  backendUrl?: string;
  apiUrl?: string;
  adminUrl?: string;
  portalUrl?: string;
  version?: string;
  branch?: string;
  commitSha?: string;
  status: DeploymentStatus;
  healthStatus: HealthStatus;
  provider: DeploymentProvider;
  deployedBy?: string;
  durationSeconds?: number;
  notes?: string;
  deployedAt: string;
  updatedAt: string;
}

export interface CreateDeploymentInput {
  projectId: string;
  environment: DeploymentEnvironment;
  frontendUrl?: string;
  backendUrl?: string;
  apiUrl?: string;
  adminUrl?: string;
  portalUrl?: string;
  version?: string;
  branch?: string;
  commitSha?: string;
  status?: DeploymentStatus;
  healthStatus?: HealthStatus;
  provider?: DeploymentProvider;
  notes?: string;
}

export interface UpdateDeploymentInput extends Partial<CreateDeploymentInput> {
  id: string;
}

export interface DeploymentSummary {
  activeEnvironments: number;
  totalDeployments: number;
  productionStatus: DeploymentStatus;
  lastSuccessfulDeploy?: string;
  healthyCount: number;
  warningCount: number;
}
