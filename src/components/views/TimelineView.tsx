import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle01Icon,
  Add01Icon,
  Calendar01Icon
} from '@hugeicons/core-free-icons';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import type { Milestone } from '../../types';

interface TimelineViewProps {
  milestones: Milestone[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ milestones }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Timelines & Milestones
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Gantt schedule, deliverable sprint phases, and client completion dates.
          </p>
        </div>
        <GlassButton variant="primary">
          <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" /> Add Milestone
        </GlassButton>
      </div>

      {/* Main Timeline Card Container */}
      <GlassCard hoverEffect={false} className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 text-sm text-zinc-300 font-semibold">
            <HugeiconsIcon icon={Calendar01Icon} size={16} className="text-zinc-400" />
            <span>Sprint Roadmap Q3 2026</span>
          </div>
          <GlassBadge variant="zinc" size="sm">
            4 Active Milestones
          </GlassBadge>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
          {milestones.map((m) => {
            const isDone = m.status === 'completed';
            return (
              <div key={m.id} className="relative group">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center ${
                    isDone
                      ? 'bg-white border-white text-black'
                      : 'bg-zinc-950 border-zinc-700'
                  }`}
                >
                  {isDone && <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} className="text-black" />}
                </div>

                <div className="p-4 rounded-[18px] bg-zinc-900/60 border border-zinc-800/70 hover:border-zinc-700 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {m.title}
                        </h3>
                        <GlassBadge variant={isDone ? 'solid' : 'zinc'} size="sm">
                          {m.phase}
                        </GlassBadge>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 font-mono">
                        Project: {m.projectName} • Target Date: {m.dueDate}
                      </p>
                    </div>

                    <div className="text-right shrink-0 font-mono text-xs text-zinc-300">
                      <span>{m.progress}% Completed</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-200 rounded-full transition-all duration-500"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
