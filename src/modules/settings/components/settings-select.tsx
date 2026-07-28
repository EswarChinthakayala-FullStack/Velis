import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';

export interface SelectOption {
  value: string;
  label: string;
}

interface SettingsSelectProps {
  label: string;
  description?: string;
  value: string;
  onValueChange: (val: string) => void;
  options: SelectOption[];
  disabled?: boolean;
}

export const SettingsSelect: React.FC<SettingsSelectProps> = ({
  label,
  description,
  value,
  onValueChange,
  options,
  disabled = false,
}) => {
  const selectedObj = options.find((o) => o.value === value);

  return (
    <div className="space-y-1.5 font-mono">
      <label className="block text-xs font-bold text-zinc-300 font-sans">
        {label}
      </label>
      {description && <p className="text-[11px] text-zinc-500 font-sans pb-0.5">{description}</p>}
      <Select value={value} onValueChange={(val: any) => onValueChange(String(val))} disabled={disabled}>
        <SelectTrigger className="h-9 text-xs bg-[#0c0c0e] border-zinc-800 rounded-lg">
          <SelectValue placeholder="Select option">
            {selectedObj?.label || value}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-xs font-mono">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
