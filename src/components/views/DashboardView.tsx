import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FolderCheckIcon,
  GitCommitIcon,
  Money01Icon,
  Clock01Icon,
  ArrowUpRight01Icon,
  GitBranchIcon
} from '@hugeicons/core-free-icons';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import type { Project, Commit, Milestone, ViewMode } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

interface DashboardViewProps {
  projects: Project[];
  commits: Commit[];
  milestones: Milestone[];
  onSelectView: (view: ViewMode) => void;
  onOpenCreateProject: () => void;
}

const REVENUE_DATA = [
  { month: 'Jan', revenue: 14200, hours: 160 },
  { month: 'Feb', revenue: 18500, hours: 175 },
  { month: 'Mar', revenue: 22000, hours: 190 },
  { month: 'Apr', revenue: 19800, hours: 165 },
  { month: 'May', revenue: 27400, hours: 210 },
  { month: 'Jun', revenue: 31000, hours: 230 },
  { month: 'Jul', revenue: 38500, hours: 245 }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  commits,
  milestones,
  onSelectView,
  onOpenCreateProject
}) => {
  const activeProjectsCount = projects.filter((p) => p.status === 'in_progress' || p.status === 'review').length;
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Developer Workspace
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Real-time telemetry, active client projects & GitHub workflow sync.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GlassButton variant="secondary" onClick={() => onSelectView('github')}>
            <HugeiconsIcon icon={GitBranchIcon} size={16} className="mr-2 inline" /> Repos Sync
          </GlassButton>
          <GlassButton variant="primary" onClick={onOpenCreateProject}>
            + New Project
          </GlassButton>
        </div>
      </div>

      {/* Top Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <GlassCard hoverEffect className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
              Active Projects
            </span>
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <HugeiconsIcon icon={FolderCheckIcon} size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{activeProjectsCount}</span>
            <GlassBadge variant="zinc" size="sm">+2 this month</GlassBadge>
          </div>
          <p className="text-[11px] text-zinc-400">Out of {projects.length} total client projects</p>
        </GlassCard>

        {/* Metric 2 */}
        <GlassCard hoverEffect className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
              GitHub Commits
            </span>
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <HugeiconsIcon icon={GitCommitIcon} size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">48</span>
            <GlassBadge variant="zinc" size="sm">Active Main Branch</GlassBadge>
          </div>
          <p className="text-[11px] text-zinc-400">4 repositories linked & synced</p>
        </GlassCard>

        {/* Metric 3 */}
        <GlassCard hoverEffect className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
              Contract Value
            </span>
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <HugeiconsIcon icon={Money01Icon} size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">
              ${(totalBudget / 1000).toFixed(1)}k
            </span>
            <GlassBadge variant="solid" size="sm">82% Billed</GlassBadge>
          </div>
          <p className="text-[11px] text-zinc-400">${(totalSpent / 1000).toFixed(1)}k logged expenses</p>
        </GlassCard>

        {/* Metric 4 */}
        <GlassCard hoverEffect className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
              Average Delivery SLA
            </span>
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <HugeiconsIcon icon={Clock01Icon} size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">99.4%</span>
            <GlassBadge variant="zinc" size="sm">On Schedule</GlassBadge>
          </div>
          <p className="text-[11px] text-zinc-400">Zero delayed client milestones</p>
        </GlassCard>
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Billing Performance Chart */}
        <GlassCard hoverEffect={false} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Revenue & Developer Hours
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Monthly billable performance across client engagements
              </p>
            </div>
            <GlassButton variant="ghost" size="sm" onClick={() => onSelectView('client_portal')}>
              Client Invoices <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} className="ml-1" />
            </GlassButton>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FAFAFA" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FAFAFA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#71717A" fontSize={12} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: 'rgba(255, 255, 255, 0.14)', strokeDasharray: '4 4' }}
                  contentStyle={{
                    backgroundColor: 'rgba(17, 17, 19, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    color: '#FAFAFA',
                    fontSize: '12px',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(16px)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FAFAFA"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 5, fill: '#FAFAFA', stroke: '#111113', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* GitHub Live Feed */}
        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={GitBranchIcon} size={16} className="text-zinc-400" />
              <h3 className="text-sm font-semibold text-white">Live GitHub Feed</h3>
            </div>
            <GlassButton variant="ghost" size="sm" onClick={() => onSelectView('github')}>
              View All
            </GlassButton>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {commits.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:bg-zinc-800/50 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={c.avatar}
                      alt={c.author}
                      className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                    />
                    <span className="font-mono text-zinc-300 text-[11px]">
                      {c.repoName}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500">{c.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-200 font-medium line-clamp-1">
                  {c.message}
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>commit {c.hash}</span>
                  <span>branch: {c.branch}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom Row: Active Projects & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects Quick Summary */}
        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
            <h3 className="text-base font-semibold text-white">
              High Priority Deliverables
            </h3>
            <GlassButton variant="ghost" size="sm" onClick={() => onSelectView('projects')}>
              View Board
            </GlassButton>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-[16px] bg-zinc-900/60 border border-zinc-800/70 hover:border-zinc-700 transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {p.name}
                    </h4>
                    <GlassBadge variant="zinc" size="sm">
                      {p.status.replace('_', ' ')}
                    </GlassBadge>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{p.clientName}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-white">{p.progress}%</div>
                  <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-zinc-200 rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Milestone Timeline Checklist */}
        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
            <h3 className="text-base font-semibold text-white">
              Upcoming Deliverable Milestones
            </h3>
            <GlassButton variant="ghost" size="sm" onClick={() => onSelectView('timeline')}>
              Timeline View
            </GlassButton>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-[16px] bg-zinc-900/60 border border-zinc-800/70 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-200">
                      {m.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                    <span>{m.projectName}</span>
                    <span>•</span>
                    <span>Due: {m.dueDate}</span>
                  </div>
                </div>
                <GlassBadge variant={m.status === 'completed' ? 'solid' : 'zinc'} size="sm">
                  {m.phase}
                </GlassBadge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
