import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';

interface IconProps {
  icon: any;
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  icon,
  size = 20,
  className = '',
  strokeWidth = 1.5,
  color = 'currentColor'
}) => {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
};
