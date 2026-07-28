import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterIcon } from '@hugeicons/core-free-icons';

interface ReleaseFiltersProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  readOnly?: boolean;
}

export const ReleaseFilters: React.FC<ReleaseFiltersProps> = ({
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  readOnly = false,
}) => {
  return (
    <div className="flex items-center gap-2 w-full md:w-auto font-mono select-none">
      {/* Type Filter */}
      <div className="flex-1 md:w-36 min-w-0">
        <Select value={selectedType} onValueChange={(val: any) => onTypeChange(String(val))}>
          <SelectTrigger className="h-9 text-xs bg-[#0c0c0e] border-zinc-800 focus:border-zinc-600 rounded-lg">
            <div className="flex items-center gap-1.5 truncate">
              <HugeiconsIcon icon={FilterIcon} size={12} className="text-zinc-500 shrink-0" />
              <SelectValue placeholder="All Types" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-xs">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="stable">Stable</SelectItem>
            <SelectItem value="major">Major Release</SelectItem>
            <SelectItem value="minor">Minor Feature</SelectItem>
            <SelectItem value="patch">Patch</SelectItem>
            <SelectItem value="hotfix">Hotfix</SelectItem>
            <SelectItem value="beta">Beta</SelectItem>
            <SelectItem value="alpha">Alpha</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter (Admin View Only) */}
      {!readOnly && (
        <div className="flex-1 md:w-36 min-w-0">
          <Select value={selectedStatus} onValueChange={(val: any) => onStatusChange(String(val))}>
            <SelectTrigger className="h-9 text-xs bg-[#0c0c0e] border-zinc-800 focus:border-zinc-600 rounded-lg">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-xs">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
