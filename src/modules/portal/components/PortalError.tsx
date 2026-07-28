import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Time01Icon, CancelCircleIcon, Alert02Icon, SecurityCheckIcon } from '@hugeicons/core-free-icons';
import { AppLogo } from '../../../components/ui/AppLogo';
import { AuthBackground } from '../../auth/components/AuthBackground';
import type { PortalAuthState } from '../lib/types/portal';

interface PortalErrorProps {
  state: PortalAuthState;
  message?: string | null;
}

export const PortalError: React.FC<PortalErrorProps> = ({ state, message }) => {
  let title = 'Access Unavailable';
  let description = 'This share link cannot be accessed.';
  let icon = Alert02Icon;
  let accentColor = 'text-red-400 bg-red-500/10 border-red-500/20';
  let glowColor = 'bg-red-500/15';

  if (state === 'expired') {
    title = 'Link Expired';
    description = 'This share link has passed its expiration date. Please contact the project administrator for a new link.';
    icon = Time01Icon;
    accentColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    glowColor = 'bg-amber-500/15';
  } else if (state === 'revoked' || state === 'disabled') {
    title = 'Access Disabled';
    description = 'Access to this client portal has been disabled or revoked by the workspace administrator.';
    icon = CancelCircleIcon;
    accentColor = 'text-red-400 bg-red-500/10 border-red-500/20';
    glowColor = 'bg-red-500/15';
  } else if (state === 'invalid') {
    title = 'Invalid Share Link';
    description = 'This share link is invalid or no longer exists. Check the link URL or request access.';
    icon = Alert02Icon;
    accentColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    glowColor = 'bg-rose-500/15';
  } else if (state === 'view_limit_exceeded') {
    title = 'View Limit Exceeded';
    description = 'This share link has reached its maximum allowed view limit.';
    icon = Time01Icon;
    accentColor = 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    glowColor = 'bg-orange-500/15';
  }

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans overflow-hidden">
      {/* Architectural Dark Monochrome Background */}
      <AuthBackground />

      {/* Main Glass Error Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative z-10 max-w-md w-full bg-[#0c0c0e]/95 border border-zinc-800/90 rounded-lg p-8 backdrop-blur-2xl shadow-2xl space-y-6"
      >
        {/* Animated Brand Logo */}
        <div className="relative flex items-center justify-center">
          <div className={`absolute -inset-4 rounded-full ${glowColor} blur-xl animate-pulse`} />
          <AppLogo size={52} showText={false} animated />
        </div>

        {/* State Icon Badge */}
        <div className="flex justify-center">
          <div className={`p-3.5 rounded-lg border flex items-center justify-center ${accentColor}`}>
            <HugeiconsIcon icon={icon} size={24} />
          </div>
        </div>

        {/* Title & Detailed Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">{title}</h2>
          <p className="text-xs text-zinc-300 font-sans leading-relaxed max-w-xs mx-auto">
            {message || description}
          </p>
        </div>

        {/* Info Callout */}
        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] font-mono text-zinc-400">
          If you believe this is an error, please contact your project manager to generate a new share link.
        </div>

        {/* Security Footer Badge */}
        <div className="pt-3 border-t border-zinc-800/80 w-full flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-mono">
          <HugeiconsIcon icon={SecurityCheckIcon} size={14} className="text-zinc-500 shrink-0" />
          <span>EsFlow Read-Only Client Security</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PortalError;
