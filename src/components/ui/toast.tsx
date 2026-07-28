import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, InformationCircleIcon, Cancel01Icon } from '@hugeicons/core-free-icons';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

type ToastListener = (toasts: ToastMessage[]) => void;

let toastsStore: ToastMessage[] = [];
const listeners: Set<ToastListener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener([...toastsStore]));
}

export const toast = {
  success: (message: string, duration = 3000) => {
    const id = crypto.randomUUID();
    toastsStore = [...toastsStore, { id, type: 'success', message }];
    notifyListeners();
    setTimeout(() => {
      toast.dismiss(id);
    }, duration);
  },
  error: (message: string, duration = 4000) => {
    const id = crypto.randomUUID();
    toastsStore = [...toastsStore, { id, type: 'error', message }];
    notifyListeners();
    setTimeout(() => {
      toast.dismiss(id);
    }, duration);
  },
  info: (message: string, duration = 3000) => {
    const id = crypto.randomUUID();
    toastsStore = [...toastsStore, { id, type: 'info', message }];
    notifyListeners();
    setTimeout(() => {
      toast.dismiss(id);
    }, duration);
  },
  dismiss: (id: string) => {
    toastsStore = toastsStore.filter((t) => t.id !== id);
    notifyListeners();
  },
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => setToasts(newToasts);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0c0c0e]/95 border border-zinc-800/90 shadow-2xl backdrop-blur-md font-sans text-xs text-zinc-100 select-none"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {item.type === 'success' && (
                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                </div>
              )}
              {item.type === 'info' && (
                <div className="p-1 rounded-full bg-sky-500/10 text-sky-400 shrink-0">
                  <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                </div>
              )}
              {item.type === 'error' && (
                <div className="p-1 rounded-full bg-rose-500/10 text-rose-400 shrink-0">
                  <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                </div>
              )}
              <span className="truncate font-mono text-[11px] text-zinc-200">{item.message}</span>
            </div>

            <button
              type="button"
              onClick={() => toast.dismiss(item.id)}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
