import React from 'react';

interface SettingsCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  headerAction,
  className = '',
}) => {
  return (
    <div className={`p-4 sm:p-5 rounded-xl bg-[#0c0c0e]/90 border border-zinc-800/80 font-mono shadow-xl backdrop-blur-xl space-y-4 ${className}`}>
      {(title || description || headerAction) && (
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div>
            {title && <h3 className="text-sm font-bold text-white font-sans tracking-tight">{title}</h3>}
            {description && <p className="text-xs text-zinc-500 font-sans mt-0.5">{description}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
