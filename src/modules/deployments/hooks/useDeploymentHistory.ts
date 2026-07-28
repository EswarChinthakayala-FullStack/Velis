import { useMemo } from 'react';
import type { DeploymentItem } from '../types/deployment';

export function useDeploymentHistory(deployments: DeploymentItem[]) {
  return useMemo(() => {
    return [...deployments].sort(
      (a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()
    );
  }, [deployments]);
}
