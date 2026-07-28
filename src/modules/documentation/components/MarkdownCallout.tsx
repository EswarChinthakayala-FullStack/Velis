import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  InformationSquareIcon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  AlertCircleIcon,
  HelpCircleIcon,
} from '@hugeicons/core-free-icons';

export type CalloutType = 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION' | 'SUCCESS' | 'ERROR';

interface MarkdownCalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

const CALLOUT_CONFIG: Record<
  CalloutType,
  { icon: any; title: string; containerClass: string; iconClass: string }
> = {
  NOTE: {
    icon: InformationSquareIcon,
    title: 'Note',
    containerClass: 'bg-zinc-900/90 border-zinc-800 text-zinc-300',
    iconClass: 'text-zinc-400',
  },
  TIP: {
    icon: CheckmarkCircle02Icon,
    title: 'Tip',
    containerClass: 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300',
    iconClass: 'text-emerald-400',
  },
  IMPORTANT: {
    icon: AlertCircleIcon,
    title: 'Important',
    containerClass: 'bg-indigo-950/20 border-indigo-800/40 text-indigo-300',
    iconClass: 'text-indigo-400',
  },
  WARNING: {
    icon: Alert02Icon,
    title: 'Warning',
    containerClass: 'bg-amber-950/20 border-amber-800/40 text-amber-300',
    iconClass: 'text-amber-400',
  },
  CAUTION: {
    icon: AlertCircleIcon,
    title: 'Caution',
    containerClass: 'bg-rose-950/20 border-rose-800/40 text-rose-300',
    iconClass: 'text-rose-400',
  },
  SUCCESS: {
    icon: CheckmarkCircle02Icon,
    title: 'Success',
    containerClass: 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300',
    iconClass: 'text-emerald-400',
  },
  ERROR: {
    icon: HelpCircleIcon,
    title: 'Error',
    containerClass: 'bg-rose-950/20 border-rose-800/40 text-rose-300',
    iconClass: 'text-rose-400',
  },
};

export const MarkdownCallout: React.FC<MarkdownCalloutProps> = ({ type, children }) => {
  const config = CALLOUT_CONFIG[type] || CALLOUT_CONFIG.NOTE;
  const IconComponent = config.icon;

  return (
    <div
      className={`my-4 p-4 rounded-lg border font-mono text-xs shadow-sm flex items-start gap-3 select-none ${config.containerClass}`}
    >
      <HugeiconsIcon icon={IconComponent} size={18} className={`shrink-0 mt-0.5 ${config.iconClass}`} />
      <div className="space-y-1 min-w-0 flex-1">
        <div className="font-bold uppercase tracking-wider text-[11px] font-sans text-white">
          {config.title}
        </div>
        <div className="text-zinc-300 leading-relaxed font-sans text-xs sm:text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MarkdownCallout;
