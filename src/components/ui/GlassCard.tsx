import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: string;
  padding?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  padding = 'p-6',
  ...props
}) => {
  return (
    <motion.div
      whileHover={
        hoverEffect
          ? {
              scale: 1.008,
              y: -2,
              borderColor: 'rgba(255, 255, 255, 0.16)',
              backgroundColor: 'rgba(39, 39, 42, 0.82)'
            }
          : undefined
      }
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-lg bg-[rgba(24,24,27,0.72)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] inset-shadow-sm ${padding} ${className}`}
      {...props}
    >
      {/* Subtle top reflection light line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </motion.div>
  );
};
