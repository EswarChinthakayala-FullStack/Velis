import React from 'react';
import { useSharePortalSettings, useUpdateSettingKey } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { SettingsInput } from './settings-input';
import { SettingsSwitch } from './settings-switch';
import type { SharePortalSettings } from '../types/settings';

export const SharePortalSettingsSection: React.FC = () => {
  const { data: portal, isLoading } = useSharePortalSettings();
  const updateMutation = useUpdateSettingKey<SharePortalSettings>();

  if (isLoading || !portal) {
    return <div className="p-6 rounded-xl bg-zinc-900/40 animate-pulse h-64" />;
  }

  const handleUpdate = (updated: Partial<SharePortalSettings>) => {
    const newValue = { ...portal, ...updated };
    updateMutation.mutate({ key: 'share_portal', value: newValue });
  };

  return (
    <div className="space-y-4 font-mono select-none">
      <SettingsCard title="Default Share Token Security" description="Security rules applied when creating new client share links.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-zinc-800/40">
          <SettingsInput
            label="Default Expiration (days)"
            type="number"
            value={portal.defaultExpirationDays}
            onChange={(e) => handleUpdate({ defaultExpirationDays: Number(e.target.value) })}
            min={1}
            max={365}
          />
          <SettingsInput
            label="Viewer Session Timeout (minutes)"
            type="number"
            value={portal.sessionTimeoutMinutes}
            onChange={(e) => handleUpdate({ sessionTimeoutMinutes: Number(e.target.value) })}
            min={5}
            max={1440}
          />
        </div>

        <div className="space-y-2 pt-3">
          <SettingsSwitch
            label="Require Password Protection by Default"
            description="Enforces password protection on all newly generated client share links."
            checked={portal.requirePassword}
            onChange={(checked) => handleUpdate({ requirePassword: checked })}
          />
          <SettingsSwitch
            label="Strict Internal Section Redaction"
            description="Automatically hides internal admin notes, private URLs, and backend endpoints from client view."
            checked={portal.hideInternalSections}
            onChange={(checked) => handleUpdate({ hideInternalSections: checked })}
          />
          <SettingsSwitch
            label="Allow Deliverable & Asset Downloads"
            description="Permits clients to download attached files and exports."
            checked={portal.allowDownloads}
            onChange={(checked) => handleUpdate({ allowDownloads: checked })}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Default Portal Tab Visibility" description="Toggle which sections are visible to client portal viewers by default.">
        <div className="space-y-2">
          <SettingsSwitch
            label="Show Timeline & Progress Updates"
            checked={portal.showTimeline}
            onChange={(checked) => handleUpdate({ showTimeline: checked })}
          />
          <SettingsSwitch
            label="Show Version Changelog & Release Notes"
            checked={portal.showChangelog}
            onChange={(checked) => handleUpdate({ showChangelog: checked })}
          />
          <SettingsSwitch
            label="Show Finances, Invoices & Sign-Offs"
            checked={portal.showPayments}
            onChange={(checked) => handleUpdate({ showPayments: checked })}
          />
          <SettingsSwitch
            label="Show Deployment Environments & Live URLs"
            checked={portal.showDeployments}
            onChange={(checked) => handleUpdate({ showDeployments: checked })}
          />
          <SettingsSwitch
            label="Show Documentation & Specifications"
            checked={portal.showDocs}
            onChange={(checked) => handleUpdate({ showDocs: checked })}
          />
        </div>
      </SettingsCard>
    </div>
  );
};
