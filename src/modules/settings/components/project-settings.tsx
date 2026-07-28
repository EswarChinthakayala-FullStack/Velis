import React from 'react';
import { useProjectDefaultSettings, useUpdateSettingKey } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { SettingsSelect } from './settings-select';
import type { ProjectDefaultSettings } from '../types/settings';

export const ProjectSettingsSection: React.FC = () => {
  const { data: defaults, isLoading } = useProjectDefaultSettings();
  const updateMutation = useUpdateSettingKey<ProjectDefaultSettings>();

  if (isLoading || !defaults) {
    return <div className="p-6 rounded-xl bg-zinc-900/40 animate-pulse h-64" />;
  }

  const handleUpdate = (updated: Partial<ProjectDefaultSettings>) => {
    const newValue = { ...defaults, ...updated };
    updateMutation.mutate({ key: 'project_defaults', value: newValue });
  };

  return (
    <div className="space-y-4 font-mono select-none">
      <SettingsCard title="Default Project Creation Attributes" description="Preset status, priority, and default currency for newly initialized projects.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsSelect
            label="Default Initial Status"
            value={defaults.defaultStatus}
            onValueChange={(val: any) => handleUpdate({ defaultStatus: val })}
            options={[
              { value: 'in_progress', label: 'In Progress' },
              { value: 'planning', label: 'Planning' },
              { value: 'review', label: 'In Review' },
              { value: 'on_hold', label: 'On Hold' },
            ]}
          />
          <SettingsSelect
            label="Default Initial Priority"
            value={defaults.defaultPriority}
            onValueChange={(val: any) => handleUpdate({ defaultPriority: val })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />
          <SettingsSelect
            label="Default Project Visibility"
            value={defaults.defaultVisibility}
            onValueChange={(val: any) => handleUpdate({ defaultVisibility: val })}
            options={[
              { value: 'private', label: 'Private (Admin Only)' },
              { value: 'shareable', label: 'Shareable (Client Portal Enabled)' },
            ]}
          />
          <SettingsSelect
            label="Default Currency"
            value={defaults.defaultCurrency}
            onValueChange={(val) => handleUpdate({ defaultCurrency: val })}
            options={[
              { value: 'USD', label: 'USD ($)' },
              { value: 'EUR', label: 'EUR (€)' },
              { value: 'GBP', label: 'GBP (£)' },
            ]}
          />
        </div>
      </SettingsCard>
    </div>
  );
};
