import React from 'react';
import { motion } from 'framer-motion';

interface PasswordCardProps {
  children: React.ReactNode;
  isError?: boolean;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({ children, isError = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={
        isError
          ? {
              x: [0, -8, 8, -8, 8, 0],
              transition: { duration: 0.4 },
            }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={{ duration: 0.2 }}
      className="w-full max-w-[420px] rounded-lg bg-[#0c0c0e]/95 border border-zinc-800/90 p-8 backdrop-blur-2xl shadow-2xl space-y-6 font-sans text-zinc-100"
    >
      {children}
    </motion.div>
  );
};
