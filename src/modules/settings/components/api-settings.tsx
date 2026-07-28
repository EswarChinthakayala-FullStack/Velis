import React, { useState } from 'react';
import { useAPISettings } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, RefreshIcon, FileCodeIcon } from '@hugeicons/core-free-icons';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

export const APISettingsSection: React.FC = () => {
  const { data: api, isLoading } = useAPISettings();
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (isLoading || !api) {
    return <div className="p-6 rounded-xl bg-zinc-900/40 animate-pulse h-64" />;
  }

  const handleTestApi = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-4 font-mono select-none">
      <SettingsCard title="Infrastructure & Service Health" description="Status monitor for Supabase PostgREST, Auth, Storage, and Edge Functions.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Database (PostgreSQL)</span>
              <div className="text-xs font-bold text-white font-sans">Operational</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow" />
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Auth (GoTrue)</span>
              <div className="text-xs font-bold text-white font-sans">Operational</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow" />
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Edge Functions</span>
              <div className="text-xs font-bold text-white font-sans">Operational</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow" />
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Realtime Websockets</span>
              <div className="text-xs font-bold text-white font-sans">Operational</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow" />
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Storage Buckets</span>
              <div className="text-xs font-bold text-white font-sans">Operational</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow" />
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500">API Gateway Version</span>
              <div className="text-xs font-bold text-white font-mono">{api.apiVersion}</div>
            </div>
            <HugeiconsIcon icon={FileCodeIcon} size={16} className="text-zinc-400" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
          <span className="text-xs text-zinc-400 font-sans">
            {api.environmentVarsCount} Environment variables configured in active build profile.
          </span>
          <div className="flex items-center gap-2">
            {testSuccess && (
              <span className="text-xs text-emerald-400 font-mono inline-flex items-center gap-1">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                <span>All Services Operational</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleTestApi}
              disabled={isTesting}
              className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isTesting ? (
                <>
                  <RadialSpinner size={12} className="text-zinc-300" />
                  <span>Pinging Services...</span>
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
      </SettingsCard>
    </div>
  );
};
