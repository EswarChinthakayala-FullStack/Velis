import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, Time01Icon, CancelCircleIcon } from '@hugeicons/core-free-icons';

interface PortalPasswordErrorProps {
  errorType?: 'invalid_password' | 'expired' | 'disabled' | 'rate_limited' | 'network_error' | string | null;
  message?: string | null;
}

export const PortalPasswordError: React.FC<PortalPasswordErrorProps> = ({ errorType, message }) => {
  if (!errorType && !message) return null;

  let text = message || 'Incorrect password. Please try again.';
  let icon = Alert02Icon;

  if (errorType === 'invalid_password') {
    text = 'Incorrect password. Please try again.';
  } else if (errorType === 'expired') {
    text = 'This share link has expired.';
    icon = Time01Icon;
  } else if (errorType === 'disabled' || errorType === 'revoked') {
    text = 'This share link is no longer active.';
    icon = CancelCircleIcon;
  } else if (errorType === 'rate_limited') {
    text = 'Too many attempts. Please wait before trying again.';
    icon = Time01Icon;
  } else if (errorType === 'network_error') {
    text = 'Unable to verify your access. Please check your connection.';
  }

  return (
    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono flex items-center gap-2.5 select-none">
      <HugeiconsIcon icon={icon} size={15} className="shrink-0 text-rose-400" />
      <span>{text}</span>
    </div>
  );
};
