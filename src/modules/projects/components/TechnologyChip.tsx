import React from 'react';
import { TechnologyIcon } from './TechnologyIcon';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

interface TechnologyChipProps {
  name: string;
  iconUrl?: string;
  version?: string;
  onRemove?: () => void;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

/**
 * Liquid Glass Technology Tag Chip
 */
export const TechnologyChip: React.FC<TechnologyChipProps> = ({
  name,
  iconUrl,
  version,
  onRemove,
  onClick,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800/90 text-zinc-200 hover:border-zinc-700/80 transition-all backdrop-blur-md shadow-sm select-none ${
        isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-medium'
      } ${onClick ? 'cursor-pointer hover:bg-zinc-800/80' : ''}`}
    >
      <TechnologyIcon name={name} iconUrl={iconUrl} size={isSm ? 13 : 15} />
      <span>{name}</span>
      {version && (
        <span className="text-[10px] font-mono text-zinc-500 font-normal">{version}</span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 text-zinc-500 hover:text-rose-400 transition-colors p-0.5 rounded cursor-pointer"
          title={`Remove ${name}`}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={isSm ? 11 : 13} />
        </button>
      )}
    </div>
  );
};

export default TechnologyChip;
