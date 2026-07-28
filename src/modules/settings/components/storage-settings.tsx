import React from 'react';
import { useStorageSettings } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { HugeiconsIcon } from '@hugeicons/react';
import { FolderCodeIcon, HardDriveIcon } from '@hugeicons/core-free-icons';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export const StorageSettingsSection: React.FC = () => {
  const { data: storage, isLoading } = useStorageSettings();

  if (isLoading || !storage) {
    return <div className="p-6 rounded-xl bg-zinc-900/40 animate-pulse h-64" />;
  }

  const percentUsed = Math.min(
    100,
    Math.round((storage.totalBytesUsed / storage.totalStorageLimitBytes) * 100)
  );

  return (
    <div className="space-y-4 font-mono select-none">
      <SettingsCard title="Supabase Storage Vault Utilization" description="Live file storage usage across project assets, attachments, and invoices.">
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={HardDriveIcon} size={18} className="text-zinc-300" />
              <span className="text-xs font-bold text-white font-sans">Total Storage Allocation</span>
            </div>
            <span className="text-xs font-mono font-bold text-white">
              {formatBytes(storage.totalBytesUsed)} / {formatBytes(storage.totalStorageLimitBytes)} ({percentUsed}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-[#0c0c0e] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500">Project Files</span>
            <div className="text-sm font-bold text-white">{formatBytes(storage.projectFilesBytes)}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0c0c0e] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500">Timeline Attachments</span>
            <div className="text-sm font-bold text-white">{formatBytes(storage.timelineFilesBytes)}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0c0c0e] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500">Documentation Assets</span>
            <div className="text-sm font-bold text-white">{formatBytes(storage.docFilesBytes)}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0c0c0e] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500">Gallery Screenshots</span>
            <div className="text-sm font-bold text-white">{formatBytes(storage.assetFilesBytes)}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0c0c0e] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500">Invoices & Receipts</span>
            <div className="text-sm font-bold text-white">{formatBytes(storage.invoiceFilesBytes)}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0c0c0e] border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500">Bucket Status</span>
            <div className="text-sm font-bold text-emerald-400">Healthy (Public/Private)</div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
