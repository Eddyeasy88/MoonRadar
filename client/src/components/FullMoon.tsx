import React from 'react';
import { Coin } from '@/types';
import { Link } from 'wouter';

interface FullMoonProps {
  coin: Coin;
}

const FullMoon: React.FC<FullMoonProps> = ({ coin }) => {
  return (
    <Link href={`/coin/${coin.symbol}`}>
      <a className="relative w-full aspect-square max-w-xs mx-auto mb-4 block">
        {/* SVG Moon */}
        <svg width="100%" height="100%" viewBox="0 0 200 200" className="rounded-full">
          <defs>
            <radialGradient id="moonGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="80%" stopColor="#CCCCCC" />
              <stop offset="100%" stopColor="#999999" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="95" fill="url(#moonGradient)" />
          <circle cx="70" cy="40" r="8" fill="#999999" opacity="0.6" />
          <circle cx="120" cy="60" r="12" fill="#999999" opacity="0.6" />
          <circle cx="40" cy="90" r="10" fill="#999999" opacity="0.5" />
          <circle cx="150" cy="90" r="6" fill="#999999" opacity="0.7" />
          <circle cx="100" cy="150" r="15" fill="#999999" opacity="0.6" />
        </svg>
        
        {/* Overlay Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/40 backdrop-blur-sm w-1/3 h-1/3 rounded-full flex items-center justify-center border border-accent glow">
            <span className="text-xl font-bold text-accent">${coin.symbol}</span>
          </div>
        </div>
        
        {/* Stats Overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
          <div className="text-center">
            <span className="block text-sm text-accent font-medium">+{coin.priceChange24h.toFixed(1)}%</span>
            <span className="text-xs text-muted-foreground">Growth</span>
          </div>
          <div className="text-center">
            <span className="block text-sm text-foreground font-medium">${(coin.volume24h / 1000000).toFixed(1)}M</span>
            <span className="text-xs text-muted-foreground">Volume 24h</span>
          </div>
          <div className="text-center">
            <span className="block text-sm text-foreground font-medium">{coin.whalePercentage.toFixed(1)}%</span>
            <span className="text-xs text-muted-foreground">Whale</span>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default FullMoon;
