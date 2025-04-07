import React from 'react';

const RadarLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-12">
      <div className="w-32 h-32 rounded-full relative mb-6">
        {/* Radar Circle Animation */}
        <div className="absolute inset-0 rounded-full border-2 border-accent glow"></div>
        <div className="absolute inset-4 rounded-full border border-accent opacity-80"></div>
        <div className="absolute inset-8 rounded-full border border-accent opacity-60"></div>
        <div className="absolute inset-12 rounded-full border border-accent opacity-40"></div>
        
        {/* Radar Sweep Line Animation */}
        <div className="absolute top-1/2 left-1/2 w-16 h-1 bg-accent origin-left rounded-full radar-sweep"></div>
      </div>
      <h1 className="text-4xl font-bold text-accent tracking-wide font-orbitron">MOONRADAR</h1>
    </div>
  );
};

export default RadarLogo;
