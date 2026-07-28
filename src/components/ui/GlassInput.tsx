import React from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  label?: string;
  error?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ icon, rightElement, label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-[#A1A1AA] tracking-tight">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-[#A1A1AA] pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-[rgba(17,17,19,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-[#FAFAFA] placeholder-[#71717A] text-sm rounded-lg px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:border-[rgba(255,255,255,0.18)] focus:bg-[rgba(24,24,27,0.85)] focus:ring-1 focus:ring-white/10 ${
              icon ? 'pl-10' : ''
            } ${rightElement ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center text-[#A1A1AA]">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-zinc-400 mt-1">{error}</p>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
