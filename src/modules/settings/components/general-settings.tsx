import React from 'react';
import { useGeneralSettings, useUpdateSettingKey } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { SettingsInput } from './settings-input';
import { SettingsSelect } from './settings-select';
import { SettingsSwitch } from './settings-switch';
import type { GeneralSettings } from '../types/settings';

export const GeneralSettingsSection: React.FC = () => {
  const { data: general, isLoading } = useGeneralSettings();
  const updateMutation = useUpdateSettingKey<GeneralSettings>();

  if (isLoading || !general) {
    return <div className="p-6 rounded-xl bg-zinc-900/40 animate-pulse h-64" />;
  }

  const handleUpdate = (updated: Partial<GeneralSettings>) => {
    const newValue = { ...general, ...updated };
    updateMutation.mutate({ key: 'general', value: newValue });
  };

  return (
    <div className="space-y-4 font-mono">
      <SettingsCard title="Application Identity" description="Core system identifiers and active runtime environment.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsInput
            label="Application Name"
            value={general.appName}
            onChange={(e) => handleUpdate({ appName: e.target.value })}
          />
          <SettingsInput
            label="Current Version"
            value={general.appVersion}
            readOnly
            className="bg-zinc-950 text-zinc-400"
          />
          <SettingsSelect
            label="Active Environment"
            value={general.environment}
            onValueChange={(val) => handleUpdate({ environment: val })}
            options={[
              { value: 'production', label: 'Production' },
              { value: 'staging', label: 'Staging' },
              { value: 'development', label: 'Development' },
            ]}
          />
          <SettingsSelect
            label="Default Currency"
            value={general.defaultCurrency}
            onValueChange={(val) => handleUpdate({ defaultCurrency: val })}
            options={[
              { value: 'USD', label: 'USD ($)' },
              { value: 'EUR', label: 'EUR (€)' },
              { value: 'GBP', label: 'GBP (£)' },
              { value: 'CAD', label: 'CAD ($)' },
              { value: 'AUD', label: 'AUD ($)' },
            ]}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Localization & Formatting" description="Date, time, and language preferences across the platform.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsSelect
            label="Timezone"
            value={general.timezone}
            onValueChange={(val) => handleUpdate({ timezone: val })}
            options={[
              { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
              { value: 'America/New_York', label: 'Eastern Time (ET)' },
              { value: 'America/Chicago', label: 'Central Time (CT)' },
              { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
              { value: 'Europe/London', label: 'London (GMT/BST)' },
              { value: 'Europe/Paris', label: 'Paris (CET)' },
              { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
            ]}
          />
          <SettingsSelect
            label="Time Format"
            value={general.timeFormat}
            onValueChange={(val: any) => handleUpdate({ timeFormat: val })}
            options={[
              { value: '24h', label: '24-hour (14:30)' },
              { value: '12h', label: '12-hour (2:30 PM)' },
            ]}
          />
          <SettingsSelect
            label="Date Format"
            value={general.dateFormat}
            onValueChange={(val) => handleUpdate({ dateFormat: val })}
            options={[
              { value: 'MMM d, yyyy', label: 'Jan 15, 2026' },
              { value: 'yyyy-MM-dd', label: '2026-01-15 (ISO)' },
              { value: 'dd/MM/yyyy', label: '15/01/2026' },
              { value: 'MM/dd/yyyy', label: '01/15/2026' },
            ]}
          />
          <SettingsSelect
            label="Preferred Language"
            value={general.language}
            onValueChange={(val) => handleUpdate({ language: val })}
            options={[
              { value: 'en', label: 'English (US)' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' },
            ]}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Editor & Workspace Defaults" description="Autosave triggers and default Markdown rendering mode.">
        <div className="space-y-4">
          <SettingsSwitch
            label="Enable Auto-Save"
            description="Automatically saves draft content in documentation and notes."
            checked={general.autoSave}
            onChange={(checked) => handleUpdate({ autoSave: checked })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/40">
            <SettingsInput
              label="Auto-Save Interval (seconds)"
              type="number"
              value={general.autoSaveInterval}
              onChange={(e) => handleUpdate({ autoSaveInterval: Number(e.target.value) })}
              min={5}
              max={300}
            />
            <SettingsSelect
              label="Markdown Preview Mode"
              value={general.markdownPreviewMode}
              onValueChange={(val: any) => handleUpdate({ markdownPreviewMode: val })}
              options={[
                { value: 'split', label: 'Split View (Editor + Live Preview)' },
                { value: 'live', label: 'Live WYSIWYG Mode' },
                { value: 'edit', label: 'Write Only (Source Code)' },
              ]}
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
