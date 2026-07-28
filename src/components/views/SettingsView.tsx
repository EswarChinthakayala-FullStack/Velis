import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  GitBranchIcon,
  SecurityCheckIcon,
  UserIcon
} from '@hugeicons/core-free-icons';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassInput } from '../ui/GlassInput';
import { GlassBadge } from '../ui/GlassBadge';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Workspace & API Settings
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Configure developer tokens, GitHub webhooks, design system preferences, and agency profile.
        </p>
      </div>

      {/* Developer Profile Settings */}
      <GlassCard hoverEffect={false} className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80">
          <HugeiconsIcon icon={UserIcon} size={20} className="text-zinc-300" />
          <h2 className="text-base font-bold text-white">Developer Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput label="Full Name" defaultValue="Alex Vance" />
          <GlassInput label="Email Address" defaultValue="alex@velis.studio" />
          <GlassInput label="Agency Title" defaultValue="Velis Lead Architect & Developer" />
          <GlassInput label="Custom Domain" defaultValue="portal.velis.studio" />
        </div>

        <div className="flex justify-end pt-2">
          <GlassButton variant="primary" size="sm">
            Save Profile
          </GlassButton>
        </div>
      </GlassCard>

      {/* Integrations & API Keys */}
      <GlassCard hoverEffect={false} className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80">
          <HugeiconsIcon icon={GitBranchIcon} size={20} className="text-zinc-300" />
          <h2 className="text-base font-bold text-white">GitHub OAuth & Webhooks</h2>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                velis-agency Organization App
              </span>
              <GlassBadge variant="zinc" size="sm">
                Connected
              </GlassBadge>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Permissions: read:org, repo, write:discussion
            </p>
          </div>
          <GlassButton variant="secondary" size="sm">
            Configure Scopes
          </GlassButton>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            API Secret Tokens
          </h3>
          <GlassInput
            label="Velis Live API Key"
            defaultValue="velis_live_sec_991823x_k8s_prod"
            readOnly
          />
        </div>
      </GlassCard>

      {/* Design System Customization Info */}
      <GlassCard hoverEffect={false} className="space-y-3 border-dashed">
        <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
          <HugeiconsIcon icon={SecurityCheckIcon} size={16} className="text-zinc-400" />
          <span>Theme Engine Specifications</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed font-mono">
          Velis is running on the Liquid Glass Monochrome theme engine (Primary #050505, Secondary #09090B, Glass Surface rgba(24,24,27,0.72)). Radii system: Cards 22px, Modals 24px, Inputs/Buttons 14px.
        </p>
      </GlassCard>
    </div>
  );
};
