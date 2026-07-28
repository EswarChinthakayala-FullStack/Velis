import React from 'react';

export type BadgeVariant = 'zinc' | 'outline' | 'solid' | 'subtle';

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'zinc',
  icon,
  className = '',
  size = 'md'
}) => {
  const variantClasses: Record<BadgeVariant, string> = {
    zinc: 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/50',
    outline: 'bg-transparent text-zinc-300 border border-zinc-800',
    solid: 'bg-zinc-100 text-zinc-950 font-medium',
    subtle: 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/60'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium tracking-tight backdrop-blur-sm ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
