import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';
import { useLayoutStore } from '../../../stores/useLayoutStore';

export const MobileDrawer: React.FC = () => {
  const { isMobileOpen, setMobileOpen } = useLayoutStore();

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />

          {/* Slide-over Glass Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[rgba(17,17,19,0.95)] border-r border-zinc-800/80 backdrop-blur-2xl shadow-2xl flex flex-col lg:hidden select-none"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
              <SidebarHeader isCollapsed={false} onToggleCollapse={() => setMobileOpen(false)} />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60"
                aria-label="Close menu"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <SidebarNav isCollapsed={false} onItemClick={() => setMobileOpen(false)} />
            <SidebarFooter isCollapsed={false} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
