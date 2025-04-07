import React from 'react';
import { Coin } from '@/types';
import MoonPhase from './MoonPhase';
import WhaleIndicator from './WhaleIndicator';

interface CryptoStatsProps {
  coin: Coin;
}

const CryptoStats: React.FC<CryptoStatsProps> = ({ coin }) => {
  return (
    <div className="bg-secondary rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-3xl font-bold text-accent">${coin.price.toFixed(3)}</span>
          <span className={`text-lg ml-2 ${coin.priceChange24h > 0 ? 'text-accent' : 'text-red-500'}`}>
            {coin.priceChange24h > 0 ? '+' : ''}{coin.priceChange24h.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <MoonPhase phase={coin.moonPhase} size="md" />
          <WhaleIndicator indicator={coin.whaleIndicator} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="block text-muted-foreground text-sm">24h Volume</span>
          <span className="font-medium">${(coin.volume24h / 1000000).toFixed(1)}M</span>
        </div>
        <div>
          <span className="block text-muted-foreground text-sm">Holders</span>
          <span className="font-medium">{coin.holders?.toLocaleString() || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-muted-foreground text-sm">Whale %</span>
          <span className="font-medium">{coin.whalePercentage.toFixed(1)}%</span>
        </div>
        <div>
          <span className="block text-muted-foreground text-sm">Liquidity</span>
          <span className="font-medium">${coin.liquidity ? `${(coin.liquidity / 1000).toFixed(0)}K` : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default CryptoStats;
