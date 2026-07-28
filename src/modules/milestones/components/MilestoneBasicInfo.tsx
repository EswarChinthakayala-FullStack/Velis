import React from 'react';

interface MilestoneBasicInfoProps {
  name: string;
  error?: string;
  onChangeName: (name: string) => void;
}

export const MilestoneBasicInfo: React.FC<MilestoneBasicInfoProps> = ({
  name,
  error,
  onChangeName,
}) => {
  return (
    <div className="space-y-1 font-mono">
      <label className="text-xs font-semibold text-zinc-300">
        Deliverable Name <span className="text-rose-400">*</span>
      </label>
      <input
        type="text"
        required
        maxLength={120}
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
        placeholder="e.g. Design System & Frontend Architecture Handoff"
        className={`w-full h-9 px-3 rounded-sm bg-zinc-900 border text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors ${
          error
            ? 'border-rose-500/50 focus:border-rose-400'
            : 'border-zinc-800 focus:border-zinc-700'
        }`}
      />
      {error && <p className="text-[10px] text-rose-400">{error}</p>}
    </div>
  );
};

export default MilestoneBasicInfo;
