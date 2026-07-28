import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed rounded-lg outline-none';

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#FAFAFA] text-[#050505] font-semibold hover:bg-white shadow-[0_4px_16px_rgba(255,255,255,0.15)] border border-white/20',
    secondary:
      'bg-[rgba(24,24,27,0.8)] text-[#FAFAFA] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(39,39,42,0.9)] hover:border-[rgba(255,255,255,0.16)] backdrop-blur-md shadow-sm',
    ghost:
      'bg-transparent text-[#D4D4D8] hover:text-[#FAFAFA] hover:bg-white/[0.05]',
    danger:
      'bg-transparent text-zinc-300 border border-zinc-700/60 hover:border-zinc-500 hover:text-white hover:bg-zinc-900/40'
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2 rounded-lg',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-lg'
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.015, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.15 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </motion.button>
  );
};
