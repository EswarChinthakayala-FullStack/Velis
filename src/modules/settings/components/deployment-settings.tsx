import React from 'react';
import { useDeploymentSettings, useUpdateSettingKey } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { SettingsInput } from './settings-input';
import { SettingsSelect } from './settings-select';
import { SettingsSwitch } from './settings-switch';
import type { DeploymentSettings } from '../types/settings';

export const DeploymentSettingsSection: React.FC = () => {
  const { data: deployment, isLoading } = useDeploymentSettings();
  const updateMutation = useUpdateSettingKey<DeploymentSettings>();

  if (isLoading || !deployment) {
    return <div className="p-6 rounded-xl bg-zinc-900/40 animate-pulse h-64" />;
  }

  const handleUpdate = (updated: Partial<DeploymentSettings>) => {
    const newValue = { ...deployment, ...updated };
    updateMutation.mutate({ key: 'deployments', value: newValue });
  };

  return (
    <div className="space-y-4 font-mono select-none">
      <SettingsCard title="Deployment Environment Defaults" description="Default hosting provider and environment setup for new projects.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-zinc-800/40">
          <SettingsSelect
            label="Default Environment"
            value={deployment.defaultEnvironment}
            onValueChange={(val) => handleUpdate({ defaultEnvironment: val })}
            options={[
              { value: 'production', label: 'Production' },
              { value: 'staging', label: 'Staging' },
              { value: 'qa', label: 'QA' },
              { value: 'development', label: 'Development' },
            ]}
          />
          <SettingsSelect
            label="Default Provider"
            value={deployment.defaultProvider}
            onValueChange={(val) => handleUpdate({ defaultProvider: val })}
            options={[
              { value: 'vercel', label: 'Vercel' },
              { value: 'netlify', label: 'Netlify' },
              { value: 'railway', label: 'Railway' },
              { value: 'render', label: 'Render' },
              { value: 'aws', label: 'AWS' },
              { value: 'fly', label: 'Fly.io' },
            ]}
          />
          <SettingsInput
            label="Health Check Refresh Interval (seconds)"
            type="number"
            value={deployment.refreshIntervalSeconds}
            onChange={(e) => handleUpdate({ refreshIntervalSeconds: Number(e.target.value) })}
            min={10}
            max={3600}
          />
          <SettingsInput
            label="History Retention (days)"
            type="number"
            value={deployment.historyRetentionDays}
            onChange={(e) => handleUpdate({ historyRetentionDays: Number(e.target.value) })}
            min={1}
            max={365}
          />
        </div>

        <div className="space-y-2 pt-3">
          <SettingsSwitch
            label="Automatic Health Status Polling"
            description="Periodically checks HTTP health status of live frontend and API endpoints."
            checked={deployment.healthCheckEnabled}
            onChange={(checked) => handleUpdate({ healthCheckEnabled: checked })}
          />
          <SettingsSwitch
            label="Auto-Refresh Deployment Tables"
            description="Pulls live deployment status updates automatically while viewing workspace."
            checked={deployment.autoRefresh}
            onChange={(checked) => handleUpdate({ autoRefresh: checked })}
          />
        </div>
      </SettingsCard>
    </div>
  );
};
