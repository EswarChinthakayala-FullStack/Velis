import React, { useState } from 'react';
import type { TimelineUpdateType, TimelineVisibility } from '../lib/types/timeline';
import { UPDATE_TYPE_CONFIGS } from '../lib/utils/timeline-formatters';
import { DatePicker } from '../../../components/ui/date-picker';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  FilterIcon,
  ViewIcon,
  Tag01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';

interface TimelineMetadataPanelProps {
  entryDate: string;
  onChangeEntryDate: (date: string) => void;
  updateType: TimelineUpdateType;
  onChangeUpdateType: (type: TimelineUpdateType) => void;
  visibility: TimelineVisibility;
  onChangeVisibility: (visibility: TimelineVisibility) => void;
  tags: string[];
  onChangeTags: (tags: string[]) => void;
}

export const TimelineMetadataPanel: React.FC<TimelineMetadataPanelProps> = ({
  entryDate,
  onChangeEntryDate,
  updateType,
  onChangeUpdateType,
  visibility,
  onChangeVisibility,
  tags,
  onChangeTags,
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '');
      if (cleaned && !tags.includes(cleaned)) {
        onChangeTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChangeTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs select-none items-start">
      {/* 1. Entry Date */}
      <div className="space-y-1.5 min-w-0">
        <label className="font-semibold text-zinc-300 h-5 flex items-center gap-1.5">
          <HugeiconsIcon icon={Calendar01Icon} size={13} className="text-zinc-400" />
          <span>Date</span>
        </label>
        <DatePicker
          value={entryDate}
          onChange={(val: any) => onChangeEntryDate(String(val))}
          className="w-full h-9 rounded-sm bg-zinc-900 border-zinc-800 font-mono text-xs text-white"
        />
      </div>

      {/* 2. Category / Update Type */}
      <div className="space-y-1.5 min-w-0">
        <label className="font-semibold text-zinc-300 h-5 flex items-center gap-1.5">
          <HugeiconsIcon icon={FilterIcon} size={13} className="text-zinc-400" />
          <span>Category</span>
        </label>
        <Select
          value={updateType}
          onValueChange={(val: any) => onChangeUpdateType(String(val) as TimelineUpdateType)}
        >
          <SelectTrigger className="w-full h-9 font-mono bg-zinc-900 border-zinc-800 rounded-sm text-xs text-white hover:border-zinc-700">
            <SelectValue>
              {UPDATE_TYPE_CONFIGS[updateType]?.label || 'Select category...'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
            {Object.entries(UPDATE_TYPE_CONFIGS).map(([typeKey, cfg]) => (
              <SelectItem key={typeKey} value={typeKey} className="font-mono text-xs rounded-sm">
                {cfg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 3. Visibility (RLS Policy Mapped) */}
      <div className="space-y-1.5 min-w-0">
        <label className="font-semibold text-zinc-300 h-5 flex items-center gap-1.5">
          <HugeiconsIcon icon={ViewIcon} size={13} className="text-zinc-400" />
          <span>Visibility</span>
        </label>
        <Select
          value={visibility}
          onValueChange={(val: any) => onChangeVisibility(String(val) as TimelineVisibility)}
        >
          <SelectTrigger className="w-full h-9 font-mono bg-zinc-900 border-zinc-800 rounded-sm text-xs text-white hover:border-zinc-700">
            <SelectValue>
              {visibility === 'public' ? 'Client Visible (Public)' : 'Admin Only (Private)'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="bg-[#111113] border-zinc-800 rounded-sm">
            <SelectItem value="public" className="font-mono text-xs rounded-sm">
              Client Visible (Public)
            </SelectItem>
            <SelectItem value="private" className="font-mono text-xs rounded-sm">
              Admin Only (Private)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 4. Tags Input */}
      <div className="space-y-1.5 min-w-0">
        <label className="font-semibold text-zinc-300 h-5 flex items-center gap-1.5">
          <HugeiconsIcon icon={Tag01Icon} size={13} className="text-zinc-400" />
          <span>Tags</span>
        </label>
        <div className="space-y-1.5">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type & press enter..."
            className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
          />

          {tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] flex items-center gap-1 font-mono"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineMetadataPanel;
