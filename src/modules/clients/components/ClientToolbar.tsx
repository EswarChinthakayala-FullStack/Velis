import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, RefreshIcon, PlusSignIcon, FilterIcon } from '@hugeicons/core-free-icons';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';

interface ClientToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive') => void;
  onRefresh: () => void;
  onNewClient: () => void;
  totalCount?: number;
}

export const ClientToolbar: React.FC<ClientToolbarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  onNewClient,
  totalCount = 0,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none pb-3 border-b border-zinc-800/60">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <HugeiconsIcon
          icon={Search01Icon}
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, company, or email..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 outline-none transition-colors"
        />
      </div>

      {/* Toolbar Action Controls (All h-9 equal height) */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {/* shadcn UI Select Component for Status Filtering */}
        <Select
          value={statusFilter}
          onValueChange={(val: any) => onStatusFilterChange(val as 'all' | 'active' | 'inactive')}
        >
          <SelectTrigger className="w-[140px] h-9">
            <div className="flex items-center gap-1.5 truncate">
              <HugeiconsIcon icon={FilterIcon} size={14} className="text-zinc-500 shrink-0" />
              <SelectValue placeholder="All Statuses" />
            </div>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-sm shrink-0"
          title="Refresh Directory"
          aria-label="Refresh Directory"
        >
          <HugeiconsIcon icon={RefreshIcon} size={15} />
        </button>

        {/* Count Badge */}
        <span className="hidden md:inline-flex h-9 items-center px-3 text-[11px] font-mono rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-zinc-400">
          {totalCount} Total
        </span>

        {/* New Client Button */}
        <button
          onClick={onNewClient}
          className="h-9 px-3.5 flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-lg shrink-0"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={15} />
          <span>New Client</span>
        </button>
      </div>
    </div>
  );
};

export default ClientToolbar;
