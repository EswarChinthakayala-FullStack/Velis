import React, { useState } from 'react';
import { useSecuritySettings, useUpdateSettingKey } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { SettingsInput } from './settings-input';
import { SettingsSwitch } from './settings-switch';
import type { SecuritySettings } from '../types/settings';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShieldKeyIcon, Logout01Icon } from '@hugeicons/core-free-icons';

export const SecuritySettingsSection: React.FC = () => {
  const { data: security, isLoading } = useSecuritySettings();
  const updateMutation = useUpdateSettingKey<SecuritySettings>();
  const [loggedOutAll, setLoggedOutAll] = useState(false);

  if (isLoading || !security) {
    return <div className="p-6 rounded-xl bg-zinc-900/40 animate-pulse h-64" />;
  }

  const handleUpdate = (updated: Partial<SecuritySettings>) => {
    const newValue = { ...security, ...updated };
    updateMutation.mutate({ key: 'security', value: newValue });
  };

  const handleLogoutAllSessions = () => {
    setLoggedOutAll(true);
    setTimeout(() => setLoggedOutAll(false), 3000);
  };

  return (
    <div className="space-y-4 font-mono select-none">
      <SettingsCard title="Authentication & Session Security" description="Session lifetime, multi-factor authentication, and active browser sessions.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-zinc-800/40">
          <SettingsInput
            label="Session Inactivity Timeout (minutes)"
            type="number"
            value={security.sessionTimeoutMinutes}
            onChange={(e) => handleUpdate({ sessionTimeoutMinutes: Number(e.target.value) })}
            min={15}
            max={1440}
          />
          <SettingsInput
            label="JWT Token Expiration (hours)"
            type="number"
            value={security.jwtExpirationHours}
            onChange={(e) => handleUpdate({ jwtExpirationHours: Number(e.target.value) })}
            min={1}
            max={168}
          />
        </div>

        <div className="space-y-3 pt-3">
          <SettingsSwitch
            label="Enforce Two-Factor Authentication (2FA)"
            description="Requires an authenticator app (TOTP) code on administrator login."
            checked={security.twoFactorEnabled}
            onChange={(checked) => handleUpdate({ twoFactorEnabled: checked })}
          />

          <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <HugeiconsIcon icon={ShieldKeyIcon} size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-sans">Active Browser Sessions</h4>
                <p className="text-[11px] text-zinc-400 font-mono">1 Active session (Current Windows Browser)</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogoutAllSessions}
              className="h-8 px-3 rounded-lg bg-rose-950/30 border border-rose-900/60 hover:bg-rose-900/50 text-rose-300 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Logout01Icon} size={13} />
              <span>{loggedOutAll ? 'Sessions Logged Out' : 'Logout All Sessions'}</span>
            </button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
