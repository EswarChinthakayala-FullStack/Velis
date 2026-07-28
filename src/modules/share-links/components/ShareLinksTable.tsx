import React, { useState, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  FilterIcon,
  Sorting01Icon,
  Add01Icon,
} from '@hugeicons/core-free-icons';
import type { ShareLinkItem, ShareLinkStatus } from '../lib/types/share-link';
import { getShareLinkStatus } from '../lib/utils/share-link';
import { ShareLinkRow } from './ShareLinkRow';
import { EmptyShareLinks } from './EmptyShareLinks';

interface ShareLinksTableProps {
  links: ShareLinkItem[];
  onOpenGenerateDialog: () => void;
  onOpenAnalytics: (link: ShareLinkItem) => void;
  onDisable: (link: ShareLinkItem) => void;
  onRegenerate: (link: ShareLinkItem) => void;
  onDelete: (link: ShareLinkItem) => void;
}

export const ShareLinksTable: React.FC<ShareLinksTableProps> = ({
  links,
  onOpenGenerateDialog,
  onOpenAnalytics,
  onDisable,
  onRegenerate,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ShareLinkStatus>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'expires_at' | 'current_views' | 'last_accessed_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredLinks = useMemo(() => {
    return links
      .filter((link) => {
        // Status filter
        const status = getShareLinkStatus(link);
        if (statusFilter !== 'all' && status !== statusFilter) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchToken = link.token.toLowerCase().includes(q);
          const matchNotes = link.notes ? link.notes.toLowerCase().includes(q) : false;
          if (!matchToken && !matchNotes) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a.createdAt;
        let valB: any = b.createdAt;

        if (sortBy === 'expires_at') {
          valA = a.expiresAt || '9999-12-31';
          valB = b.expiresAt || '9999-12-31';
        } else if (sortBy === 'current_views') {
          valA = a.currentViews;
          valB = b.currentViews;
        } else if (sortBy === 'last_accessed_at') {
          valA = a.lastAccessedAt || '';
          valB = b.lastAccessedAt || '';
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [links, searchQuery, statusFilter, sortBy, sortOrder]);

  if (links.length === 0) {
    return <EmptyShareLinks onGenerate={onOpenGenerateDialog} />;
  }

  return (
    <div className="space-y-4">
      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0c0c0e]/90 p-3 rounded-xl border border-zinc-800/80 shadow-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <HugeiconsIcon icon={Search01Icon} size={15} className="absolute left-3 top-2.5 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by URL token or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 overflow-x-auto custom-scrollbar">
          {/* Filter Dropdown */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            <HugeiconsIcon icon={FilterIcon} size={14} className="text-zinc-500 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-white">All Statuses</option>
              <option value="active" className="bg-zinc-900 text-white">Active</option>
              <option value="protected" className="bg-zinc-900 text-white">Protected</option>
              <option value="expired" className="bg-zinc-900 text-white">Expired</option>
              <option value="disabled" className="bg-zinc-900 text-white">Disabled</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            <HugeiconsIcon icon={Sorting01Icon} size={14} className="text-zinc-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer"
            >
              <option value="created_at" className="bg-zinc-900 text-white">Date Created</option>
              <option value="expires_at" className="bg-zinc-900 text-white">Expiration</option>
              <option value="current_views" className="bg-zinc-900 text-white">Views</option>
              <option value="last_accessed_at" className="bg-zinc-900 text-white">Last Access</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Toggle Sort Order"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-zinc-800/80 bg-[#0c0c0e]/80 shadow-md font-mono text-xs select-none relative">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-zinc-900/90 border-b border-zinc-800 text-[11px] text-zinc-400 font-semibold uppercase tracking-wider backdrop-blur-md">
            <tr>
              <th className="py-3 px-4 font-sans">Status</th>
              <th className="py-3 px-4">Share URL</th>
              <th className="py-3 px-4 font-sans hidden sm:table-cell">Password</th>
              <th className="py-3 px-4 hidden md:table-cell">Expiration</th>
              <th className="py-3 px-4">Views</th>
              <th className="py-3 px-4 hidden lg:table-cell">Last Access</th>
              <th className="py-3 px-4 hidden xl:table-cell">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {filteredLinks.map((link) => (
              <ShareLinkRow
                key={link.id}
                link={link}
                onOpenAnalytics={onOpenAnalytics}
                onDisable={onDisable}
                onRegenerate={onRegenerate}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>

        {filteredLinks.length === 0 && (
          <div className="p-8 text-center text-xs text-zinc-500 font-sans">
            No share links match your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
