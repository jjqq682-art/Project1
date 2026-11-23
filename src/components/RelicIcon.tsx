import React from 'react';
import {
  Compass,
  Feather,
  Flame,
  Hourglass,
  KeyRound,
  Moon,
} from 'lucide-react';
import { RelicIconType } from '../types/quest';

interface RelicIconProps {
  type: RelicIconType;
  className?: string;
}

export const RelicIcon: React.FC<RelicIconProps> = ({ type, className = 'w-5 h-5' }) => {
  switch (type) {
    case 'lantern':
      return <Flame className={className} aria-hidden="true" />;
    case 'compass':
      return <Compass className={className} aria-hidden="true" />;
    case 'key':
      return <KeyRound className={className} aria-hidden="true" />;
    case 'hourglass':
      return <Hourglass className={className} aria-hidden="true" />;
    case 'feather':
      return <Feather className={className} aria-hidden="true" />;
    case 'moon':
      return <Moon className={className} aria-hidden="true" />;
    default:
      return <Flame className={className} aria-hidden="true" />;
  }
};
