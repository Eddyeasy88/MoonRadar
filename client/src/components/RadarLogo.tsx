import React from 'react';

interface RadarLogoProps {
  size?: number;
  showText?: boolean;
}

const RadarLogo: React.FC<RadarLogoProps> = ({ size = 128, showText = true }) => {
  const radarSize = `${size}px`;
  const insetSize = (n: number) => `${n * (size/32)}px`;
  const sweepWidth = `${size/2}px`;
  const sweepHeight = `${size/32}px`;
  const fontSize = `${size/3}px`;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-full relative mb-6" style={{ width: radarSize, height: radarSize }}>
        {/* Radar Circle Animation */}
        <div className="absolute inset-0 rounded-full border-2 border-accent glow"></div>
        <div className="absolute rounded-full border border-accent opacity-80" 
             style={{ inset: insetSize(4) }}></div>
        <div className="absolute rounded-full border border-accent opacity-60" 
             style={{ inset: insetSize(8) }}></div>
        <div className="absolute rounded-full border border-accent opacity-40" 
             style={{ inset: insetSize(12) }}></div>
        
        {/* Radar Sweep Line Animation */}
        <div className="absolute top-1/2 left-1/2 bg-accent origin-left rounded-full radar-sweep"
             style={{ width: sweepWidth, height: sweepHeight }}></div>
      </div>
      {showText && (
        <h1 className="font-bold text-accent tracking-wide font-orbitron" 
            style={{ fontSize }}>
          MOONRADAR
        </h1>
      )}
    </div>
  );
};

export default RadarLogo;
