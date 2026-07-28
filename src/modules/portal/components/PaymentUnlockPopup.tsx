import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  LockKeyIcon,
  Cancel01Icon,
  Copy01Icon,
  CheckmarkCircle02Icon,
  SecurityCheckIcon,
  Video01Icon,
  DocumentCodeIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons';

interface PaymentUnlockPopupProps {
  isOpen: boolean;
  onClose: () => void;
  remainingAmount: number;
  currency?: string;
  onGoToPayments?: () => void;
}

interface UpiOption {
  id: string;
  name: string;
  upiId: string;
  appBadge: string;
  badgeClass: string;
}

const UPI_METHODS: UpiOption[] = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    upiId: import.meta.env.VITE_UPI_PHONEPE || '6300570415@axl',
    appBadge: 'PhonePe UPI',
    badgeClass: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  },
  {
    id: 'hdfc',
    name: 'Paytm / HDFC',
    upiId: import.meta.env.VITE_UPI_HDFC || '6300570415@pthdfc',
    appBadge: 'Paytm',
    badgeClass: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
  },

];

export const PaymentUnlockPopup: React.FC<PaymentUnlockPopupProps> = ({
  isOpen,
  onClose,
  remainingAmount,
  currency = 'INR',
  onGoToPayments,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] = useState<number>(1);

  if (!isOpen || remainingAmount <= 0) return null;

  const currentMethod = UPI_METHODS[activeIndex];

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(remainingAmount);

  // Generate standard UPI URL and QR Code API image URL for active UPI ID
  const upiUrl = `upi://pay?pa=${encodeURIComponent(currentMethod.upiId)}&pn=EsFlow%20Projects&am=${remainingAmount}&cu=INR`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(currentMethod.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? UPI_METHODS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === UPI_METHODS.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 60 : -60,
      opacity: 0,
      scale: 0.96,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 select-none font-sans overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-sm sm:max-w-md rounded-lg bg-[#0c0c0e]/95 border border-amber-500/30 p-4 sm:p-5 font-mono text-xs space-y-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden my-auto">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-zinc-800/80 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <HugeiconsIcon icon={LockKeyIcon} size={16} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9px] font-semibold text-amber-400 uppercase tracking-wider">
                <HugeiconsIcon icon={SecurityCheckIcon} size={9} />
                Payment Required for Release
              </div>
              <h3 className="text-sm font-bold text-white font-sans tracking-tight leading-tight">
                Unlock Deliverables & Source Code
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </div>

        {/* Deliverable Lock Benefits Banner */}
        <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1 text-zinc-300 font-sans text-xs">
          <p className="leading-snug text-[11px]">
            Pay remaining balance <strong className="text-amber-400 font-mono font-bold">{formattedAmount}</strong> to instantly unlock:
          </p>
          <ul className="space-y-0.5 text-[10px] text-zinc-400 font-mono pt-0.5">
            <li className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Video01Icon} size={11} className="text-emerald-400 shrink-0" />
              <span>Production Setup Video & Deployment Guides</span>
            </li>
            <li className="flex items-center gap-1.5">
              <HugeiconsIcon icon={DocumentCodeIcon} size={11} className="text-emerald-400 shrink-0" />
              <span>Full Source Code & Automated Test Suites</span>
            </li>
          </ul>
        </div>

        {/* UPI Method Selection Tabs */}
        <div className="flex items-center justify-between p-0.5 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-[10px]">
          {UPI_METHODS.map((m, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                className={`flex-1 py-1 px-1 rounded-lg font-semibold text-center transition-all cursor-pointer truncate ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        {/* Sliding QR Code Container */}
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-zinc-950 border border-zinc-800/90 space-y-2 relative z-10 overflow-hidden">
          {/* Left / Right Slide Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer z-20 shadow-md"
            title="Previous Payment App"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={13} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer z-20 shadow-md"
            title="Next Payment App"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
          </button>

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentMethod.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="w-full flex flex-col items-center space-y-2"
            >
              {/* Method App Badge & Amount */}
              <div className="text-center space-y-0.5">
                <span className={`inline-block px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase ${currentMethod.badgeClass}`}>
                  {currentMethod.appBadge}
                </span>
                <div className="text-xl font-extrabold text-amber-400 font-mono tracking-tight pt-0.5">
                  {formattedAmount}
                </div>
              </div>

              {/* QR Image */}
              <div className="p-2 bg-white rounded-lg border border-zinc-800 shadow-xl relative group">
                <img
                  src={qrCodeImageUrl}
                  alt={`UPI QR Code for ${currentMethod.name}`}
                  className="w-36 h-36 object-contain"
                />
              </div>

              {/* UPI ID Row */}
              <div className="flex items-center justify-between gap-2 w-full max-w-xs px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[10px]">
                <div className="min-w-0">
                  <div className="text-[8px] text-zinc-500 uppercase">{currentMethod.name} UPI ID</div>
                  <div className="text-zinc-200 font-bold truncate">{currentMethod.upiId}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="h-6 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[9px] font-mono inline-flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <HugeiconsIcon icon={copied ? CheckmarkCircle02Icon : Copy01Icon} size={10} className={copied ? 'text-emerald-400' : ''} />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5 z-10">
            {UPI_METHODS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                className={`h-1.5 rounded-lg transition-all cursor-pointer ${
                  idx === activeIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
          {onGoToPayments && (
            <button
              type="button"
              onClick={() => {
                onGoToPayments();
                onClose();
              }}
              className="h-9 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono inline-flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-md"
            >
              <span>View Details</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
