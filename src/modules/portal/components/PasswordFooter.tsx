import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

interface PasswordFooterProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export const PasswordFooter: React.FC<PasswordFooterProps> = ({ isLoading = false, disabled = false }) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
    >
      <span>{isLoading ? 'Verifying...' : 'Unlock Project'}</span>
      <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
    </button>
  );
};
