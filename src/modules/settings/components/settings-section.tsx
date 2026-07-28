import React from 'react';
import { motion } from 'framer-motion';

interface SettingsSectionProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  id,
  title,
  description,
  children,
}) => {
  return (
    <motion.div
      id={`settings-section-${id}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="space-y-4 font-mono select-none"
    >
      <div className="pb-3 border-b border-zinc-800/80">
        <h2 className="text-lg font-bold text-white font-sans tracking-tight">{title}</h2>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">{description}</p>
      </div>

      <div className="space-y-4">{children}</div>
    </motion.div>
  );
};
