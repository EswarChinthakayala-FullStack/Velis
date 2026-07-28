import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <GlassCard hoverEffect={false} className="py-16 text-center max-w-lg mx-auto border-dashed">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-inner">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-[#FAFAFA]">{title}</h3>
          <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        {action && <div className="pt-2">{action}</div>}
      </motion.div>
    </GlassCard>
  );
};
