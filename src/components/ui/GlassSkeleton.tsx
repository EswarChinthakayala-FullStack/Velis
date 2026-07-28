import React from 'react';

interface GlassSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

export const GlassSkeleton: React.FC<GlassSkeletonProps> = ({
  className = '',
  width,
  height,
  borderRadius = 'rounded-[14px]'
}) => {
  return (
    <div
      style={{ width, height }}
      className={`animate-shimmer bg-zinc-800/40 border border-white/[0.04] ${borderRadius} ${className}`}
    />
  );
};
