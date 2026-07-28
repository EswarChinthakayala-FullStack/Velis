import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';

const COMMON_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'India',
  'Japan',
  'Singapore',
  'Brazil',
  'Netherlands',
  'Spain',
  'Sweden',
  'Switzerland',
  'United Arab Emirates',
];

interface CountrySelectProps {
  value?: string;
  onChange: (country: string) => void;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value || ''} onValueChange={(val: any) => onChange(val)}>
      <SelectTrigger className="w-full h-9 bg-zinc-900/90 border-zinc-800 text-xs">
        <SelectValue placeholder="Select Country..." />
      </SelectTrigger>
      <SelectContent align="start" className="max-h-56">
        {COMMON_COUNTRIES.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
