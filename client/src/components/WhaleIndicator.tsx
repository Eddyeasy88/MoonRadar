import React from 'react';
import { WhaleIndicator as WhaleIndicatorEnum } from '@/types';

interface WhaleIndicatorProps {
  indicator: WhaleIndicatorEnum;
}

const WhaleIndicator: React.FC<WhaleIndicatorProps> = ({ indicator }) => {
  const getIndicator = () => {
    switch (indicator) {
      case WhaleIndicatorEnum.ROCKET:
        return '🚀';
      case WhaleIndicatorEnum.DYNAMITE:
        return '🧨';
      case WhaleIndicatorEnum.BOMB:
        return '💣';
      default:
        return '🚀';
    }
  };
  
  return (
    <span className="text-lg">{getIndicator()}</span>
  );
};

export default WhaleIndicator;
