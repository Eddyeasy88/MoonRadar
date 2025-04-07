import React from 'react';
import { MoonPhase as MoonPhaseEnum } from '@/types';

interface MoonPhaseProps {
  phase: MoonPhaseEnum;
  size?: 'sm' | 'md' | 'lg';
}

const MoonPhase: React.FC<MoonPhaseProps> = ({ phase, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];
  
  const renderMoon = () => {
    switch (phase) {
      case MoonPhaseEnum.NEW_MOON:
        return (
          <div className={`bg-background rounded-full border border-muted-foreground ${sizeClasses}`}></div>
        );
      case MoonPhaseEnum.HALF_MOON:
        return (
          <div className={`bg-background rounded-full overflow-hidden ${sizeClasses}`}>
            <div className="w-1/2 h-full bg-muted-foreground"></div>
          </div>
        );
      case MoonPhaseEnum.FULL_MOON:
        return (
          <div className={`bg-foreground rounded-full ${sizeClasses}`}></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderMoon()}
    </div>
  );
};

export default MoonPhase;
