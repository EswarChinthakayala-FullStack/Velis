import React from 'react';

interface SettingsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
}

export const SettingsInput: React.FC<SettingsInputProps> = ({
  label,
  description,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 font-mono">
      <label className="block text-xs font-bold text-zinc-300 font-sans">
        {label}
      </label>
      {description && <p className="text-[11px] text-zinc-500 font-sans pb-0.5">{description}</p>}
      <input
        className={`w-full h-9 px-3.5 rounded-lg bg-[#0c0c0e] border border-zinc-800 text-white text-xs placeholder-zinc-500 font-mono outline-none focus:border-zinc-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-400 font-mono">{error}</p>}
    </div>
  );
};
