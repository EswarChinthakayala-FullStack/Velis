import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ArchiveIcon,
  Delete02Icon,
  ArrowRight01Icon,
  Folder01Icon,
  UserGroupIcon,
  Clock01Icon,
  ShieldKeyIcon,
} from '@hugeicons/core-free-icons';
import type { NotificationItem } from './types/notification';

interface NotificationDetailSheetProps {
  notification: NotificationItem | null;
  onClose: () => void;
  onMarkRead: (id: string, readStatus: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationDetailSheet: React.FC<NotificationDetailSheetProps> = ({
  notification,
  onClose,
  onMarkRead,
  onArchive,
  onDelete,
}) => {
  const navigate = useNavigate();
  if (!notification) return null;

  const handleOpenEntity = () => {
    onClose();
    if (notification.category === 'projects' || notification.projectId) {
      navigate('/app/projects');
    } else if (notification.category === 'clients' || notification.clientId) {
      navigate('/app/clients');
    } else if (notification.category === 'payments') {
      navigate('/app/payments');
    } else if (notification.category === 'deployments') {
      navigate('/app/deployments');
    } else if (notification.category === 'github') {
      navigate('/app/github');
    } else if (notification.category === 'changelog') {
      navigate('/app/changelog');
    } else if (notification.category === 'notes') {
      navigate('/app/notes');
    } else if (notification.category === 'share_links') {
      navigate('/app/share-links');
    } else if (notification.category === 'timeline') {
      navigate('/app/timeline');
    } else {
      navigate('/app/dashboard');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm font-mono select-none">
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md h-full bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto custom-scrollbar"
        >
          {/* Header Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {notification.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {notification.type}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            {/* Notification Main Info */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base font-bold text-white font-sans leading-tight">
                {notification.title}
              </h2>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                {notification.description || 'No additional details provided for this event.'}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 mt-4">
              <h4 className="text-[11px] font-bold text-white font-sans uppercase tracking-wider">
                Event Details & Metadata
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">Priority</span>
                  <div className="font-semibold text-white capitalize">{notification.priority}</div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">Read Status</span>
                  <div className="font-semibold text-zinc-300">
                    {notification.readStatus ? 'Read' : 'Unread'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">Timestamp</span>
                  <div className="font-mono text-[11px] text-zinc-300">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">Notification ID</span>
                  <div className="font-mono text-[10px] text-zinc-500 truncate">
                    {notification.id.split('-')[0]}...
                  </div>
                </div>
              </div>

              {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                <div className="pt-2 border-t border-zinc-800/60">
                  <span className="text-[10px] text-zinc-500 uppercase block pb-1">Raw Payload</span>
                  <pre className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 font-mono overflow-x-auto custom-scrollbar">
                    {JSON.stringify(notification.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Sheet Footer Actions */}
          <div className="space-y-3 pt-6 border-t border-zinc-800/80 mt-6">
            <button
              type="button"
              onClick={handleOpenEntity}
              className="w-full h-10 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
            >
              <span>Open Related View</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onMarkRead(notification.id, !notification.readStatus);
                  onClose();
                }}
                className="h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                <span>{notification.readStatus ? 'Unread' : 'Read'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onArchive(notification.id);
                  onClose();
                }}
                className="h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={ArchiveIcon} size={13} />
                <span>Archive</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onDelete(notification.id);
                  onClose();
                }}
                className="h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-900 text-zinc-400 hover:text-rose-400 text-xs font-mono inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Delete02Icon} size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
