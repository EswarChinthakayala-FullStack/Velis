import React from 'react';
import { useAppearanceSettings, useUpdateSettingKey } from '../hooks/useSettings';
import { SettingsCard } from './settings-card';
import { SettingsSelect } from './settings-select';
import { SettingsSwitch } from './settings-switch';
import type { AppearanceSettings } from '../types/settings';

export const AppearanceSettingsSection: React.FC = () => {
  const { data: appearance, isLoading } = useAppearanceSettings();
  const updateMutation = useUpdateSettingKey<AppearanceSettings>();

  if (isLoading || !appearance) {
    return <div className="p-6 rounded-xl bg-zinc-900/40 animate-pulse h-64" />;
  }

  const handleUpdate = (updated: Partial<AppearanceSettings>) => {
    const newValue = { ...appearance, ...updated };
    updateMutation.mutate({ key: 'appearance', value: newValue });
  };

  return (
    <div className="space-y-4 font-mono select-none">
      <SettingsCard title="EsFlow Design System & Theme Engine" description="Customize interface density, glassmorphism intensity, and motion preferences.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-zinc-800/40">
          <SettingsSelect
            label="Monochrome Palette Accent"
            value={appearance.accentColor}
            onValueChange={(val: any) => handleUpdate({ accentColor: val })}
            options={[
              { value: 'monochrome', label: 'Monochrome High-Contrast (White / Zinc)' },
              { value: 'zinc', label: 'Zinc Glass (Dark Graphite)' },
            ]}
          />
          <SettingsSelect
            label="Liquid Glass Intensity"
            value={appearance.glassIntensity}
            onValueChange={(val: any) => handleUpdate({ glassIntensity: val })}
            options={[
              { value: 'high', label: 'High Glass (90% Opacity + Backdrop Blur)' },
              { value: 'medium', label: 'Medium Glass (80% Opacity)' },
              { value: 'low', label: 'Flat Matte (Solid Dark)' },
            ]}
          />
          <SettingsSelect
            label="Sidebar Width"
            value={appearance.sidebarWidth}
            onValueChange={(val: any) => handleUpdate({ sidebarWidth: val })}
            options={[
              { value: 'normal', label: 'Standard Sidebar (w-64)' },
              { value: 'compact', label: 'Compact Sidebar (w-56)' },
            ]}
          />
          <SettingsSelect
            label="Base Color Theme"
            value={appearance.theme}
            onValueChange={(val: any) => handleUpdate({ theme: val })}
            options={[
              { value: 'dark', label: 'Deep Dark Obsidian (#080809)' },
              { value: 'system', label: 'Follow System Preference' },
            ]}
          />
        </div>

        <div className="space-y-2 pt-3">
          <SettingsSwitch
            label="Compact Data Tables & Grids"
            description="Reduces table cell padding for high data density on wide screens."
            checked={appearance.compactMode}
            onChange={(checked) => handleUpdate({ compactMode: checked })}
          />
          <SettingsSwitch
            label="UI Micro-Animations"
            description="Enables Framer Motion micro-interactions, modal transitions, and hover effects."
            checked={appearance.animationsEnabled}
            onChange={(checked) => handleUpdate({ animationsEnabled: checked })}
          />
          <SettingsSwitch
            label="Reduced Motion Mode"
            description="Disables layout shifts and animated transitions for accessibility."
            checked={appearance.reducedMotion}
            onChange={(checked) => handleUpdate({ reducedMotion: checked })}
          />
        </div>
      </SettingsCard>
    </div>
  );
};
