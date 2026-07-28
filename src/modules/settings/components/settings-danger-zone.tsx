import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon, Delete02Icon, RefreshIcon, ShieldKeyIcon } from '@hugeicons/core-free-icons';
import { ConfirmDeleteDialog } from '../../../components/ui/confirm-delete-dialog';

interface SettingsDangerZoneProps {
  onClearCache?: () => void;
  onResetPreferences?: () => void;
}

export const SettingsDangerZone: React.FC<SettingsDangerZoneProps> = ({
  onClearCache,
  onResetPreferences,
}) => {
  const [activeDialog, setActiveDialog] = useState<'cache' | 'reset' | null>(null);

  return (
    <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-900/60 font-mono space-y-4 shadow-xl select-none">
      <div className="flex items-center gap-2.5 pb-3 border-b border-rose-900/40">
        <div className="w-8 h-8 rounded-lg bg-rose-900/40 border border-rose-800 flex items-center justify-center text-rose-400">
          <HugeiconsIcon icon={AlertCircleIcon} size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-rose-400 font-sans tracking-tight">Danger Zone</h3>
          <p className="text-[11px] text-rose-300/80 font-sans">
            Irreversible system operations. Exercise caution before confirming.
          </p>
        </div>
      </div>

      <div className="space-y-3 divide-y divide-rose-900/30">
        {/* Clear Application Cache */}
        <div className="flex items-center justify-between gap-4 pt-3 first:pt-0">
          <div>
            <h4 className="text-xs font-bold text-white font-sans">Clear Client Storage Cache</h4>
            <p className="text-[11px] text-zinc-400 font-sans">
              Purges local session cache and refetches clean data from Supabase.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveDialog('cache')}
            className="h-8 px-3 rounded-lg bg-rose-900/30 border border-rose-800/80 hover:bg-rose-900/60 text-rose-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <HugeiconsIcon icon={RefreshIcon} size={13} />
            <span>Clear Cache</span>
          </button>
        </div>

        {/* Reset System Preferences */}
        <div className="flex items-center justify-between gap-4 pt-3">
          <div>
            <h4 className="text-xs font-bold text-white font-sans">Reset Application Preferences</h4>
            <p className="text-[11px] text-zinc-400 font-sans">
              Resets UI appearance, project defaults, and notification rules to factory defaults.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveDialog('reset')}
            className="h-8 px-3 rounded-lg bg-rose-900/30 border border-rose-800/80 hover:bg-rose-900/60 text-rose-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <HugeiconsIcon icon={Delete02Icon} size={13} />
            <span>Reset Preferences</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDeleteDialog
        isOpen={activeDialog === 'cache'}
        onClose={() => setActiveDialog(null)}
        onConfirm={() => {
          if (onClearCache) onClearCache();
          window.location.reload();
        }}
        title="Clear Client Storage Cache?"
        description="Are you sure you want to clear your client-side cache and reload the application?"
      />

      <ConfirmDeleteDialog
        isOpen={activeDialog === 'reset'}
        onClose={() => setActiveDialog(null)}
        onConfirm={() => {
          if (onResetPreferences) onResetPreferences();
          setActiveDialog(null);
        }}
        title="Reset System Preferences to Defaults?"
        description="This will restore all default system settings and notifications to initial values."
      />
    </div>
  );
};
