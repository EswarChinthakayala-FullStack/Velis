import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';

const COMMON_TIMEZONES = [
  'UTC (Coordinated Universal Time)',
  'America/New_York (EST/EDT)',
  'America/Chicago (CST/CDT)',
  'America/Denver (MST/MDT)',
  'America/Los_Angeles (PST/PDT)',
  'Europe/London (GMT/BST)',
  'Europe/Paris (CET/CEST)',
  'Asia/Dubai (GST)',
  'Asia/Kolkata (IST)',
  'Asia/Singapore (SGT)',
  'Asia/Tokyo (JST)',
  'Australia/Sydney (AEST/AEDT)',
];

interface TimezoneSelectProps {
  value?: string;
  onChange: (timezone: string) => void;
}

export const TimezoneSelect: React.FC<TimezoneSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value || ''} onValueChange={(val: any) => onChange(val)}>
      <SelectTrigger className="w-full h-9 bg-zinc-900/90 border-zinc-800 text-xs">
        <SelectValue placeholder="Select Timezone..." />
      </SelectTrigger>
      <SelectContent align="start" className="max-h-56">
        {COMMON_TIMEZONES.map((tz) => (
          <SelectItem key={tz} value={tz}>
            {tz}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimezoneSelect;
