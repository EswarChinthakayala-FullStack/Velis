import { useMemo } from 'react';
import type { DeploymentItem, DeploymentSummary } from '../types/deployment';

export function useDeploymentSummary(deployments: DeploymentItem[]): DeploymentSummary {
  return useMemo(() => {
    const activeEnvironments = deployments.filter((d) => d.status === 'active').length;
    const totalDeployments = deployments.length;
    
    const prod = deployments.find((d) => d.environment === 'production');
    const productionStatus = prod ? prod.status : 'offline';

    const healthyCount = deployments.filter((d) => d.healthStatus === 'healthy').length;
    const warningCount = deployments.filter((d) => d.healthStatus === 'warning').length;

    const lastSuccessfulDeploy = deployments[0]?.deployedAt;

    return {
      activeEnvironments,
      totalDeployments,
      productionStatus,
      lastSuccessfulDeploy,
      healthyCount,
      warningCount,
    };
  }, [deployments]);
}
