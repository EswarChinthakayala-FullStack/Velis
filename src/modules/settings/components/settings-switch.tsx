import React from 'react';

interface SettingsSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const SettingsSwitch: React.FC<SettingsSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-zinc-800/40 last:border-0 font-mono">
      <div className="space-y-0.5">
        <label className="text-xs font-semibold text-white font-sans cursor-pointer">
          {label}
        </label>
        {description && <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">{description}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-white' : 'bg-zinc-800'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-400'
          }`}
        />
      </button>
    </div>
  );
};
