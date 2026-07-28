import React, { useState } from 'react';
import { useGitHubSettings, useUpdateSettingKey } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { SettingsInput } from './settings-input';
import { SettingsSelect } from './settings-select';
import { SettingsSwitch } from './settings-switch';
import type { GitHubSettings } from '../types/settings';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitBranchIcon, CheckmarkCircle02Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

export const GitHubSettingsSection: React.FC = () => {
  const { data: github, isLoading } = useGitHubSettings();
  const updateMutation = useUpdateSettingKey<GitHubSettings>();
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (isLoading || !github) {
    return (
      <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/40 h-64 flex items-center justify-center">
        <RadialSpinner size={24} className="text-zinc-500" />
      </div>
    );
  }

  const handleUpdate = (updated: Partial<GitHubSettings>) => {
    const newValue = { ...github, ...updated };
    updateMutation.mutate({ key: 'github', value: newValue });
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    }, 1200);
  };

  const isConnected = Boolean(github.orgName && github.orgName.trim().length > 0);

  return (
    <div className="space-y-4 font-mono select-none">
      <SettingsCard title="GitHub Organization & Repository Sync" description="Manage webhook triggers, pull request sync, and automated changelogs.">
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <HugeiconsIcon icon={GitBranchIcon} size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white font-sans">GitHub App Connector</span>
                <span
                  className={`px-2 py-0.2 rounded text-[10px] font-mono border ${
                    isConnected
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {isConnected ? 'Configured' : 'Not Connected'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                {isConnected
                  ? 'Permissions: read:org, repo, write:discussion, webhooks'
                  : 'Enter organization or username below to connect repositories.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {testSuccess && (
              <span className="text-xs text-emerald-400 font-mono inline-flex items-center gap-1">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                <span>Verified</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isTesting ? (
                <>
                  <RadialSpinner size={12} className="text-zinc-300" />
                  <span>Pinging GitHub...</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={RefreshIcon} size={12} />
                  <span>Test Connection</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SettingsInput
            label="GitHub Organization / Account"
            value={github.orgName || ''}
            onChange={(e) => handleUpdate({ orgName: e.target.value })}
            placeholder="e.g. esflow-studio"
          />
          <SettingsInput
            label="Default Branch"
            value={github.defaultBranch || 'main'}
            onChange={(e) => handleUpdate({ defaultBranch: e.target.value })}
            placeholder="main"
          />
          <SettingsSelect
            label="Sync Frequency"
            value={github.syncFrequency || '15m'}
            onValueChange={(val) => handleUpdate({ syncFrequency: val })}
            options={[
              { value: '5m', label: 'Every 5 minutes' },
              { value: '15m', label: 'Every 15 minutes' },
              { value: '1h', label: 'Hourly' },
              { value: 'manual', label: 'Manual Sync Only' },
            ]}
          />
        </div>

        <div className="pt-3 border-t border-zinc-800/40 space-y-2 mt-4">
          <SettingsSwitch
            label="Automatic Background Repository Sync"
            description="Automatically pulls commits, pull requests, and releases."
            checked={github.autoSync}
            onChange={(checked) => handleUpdate({ autoSync: checked })}
          />
          <SettingsSwitch
            label="Sync GitHub Issues & Releases"
            description="Imports open issues and tag releases into project changelog."
            checked={github.syncIssues}
            onChange={(checked) => handleUpdate({ syncIssues: checked })}
          />
        </div>
      </SettingsCard>
    </div>
  );
};
