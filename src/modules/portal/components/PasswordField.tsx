import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';

interface PasswordFieldProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ value, onChange, disabled = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 text-left">
      <label className="text-xs font-mono text-zinc-400">Access Password</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoFocus
          autoComplete="current-password"
          className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-zinc-600 placeholder:text-zinc-700 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
          title={showPassword ? 'Hide Password' : 'Show Password'}
        >
          <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={15} />
        </button>
      </div>
    </div>
  );
};
