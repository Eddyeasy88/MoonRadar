import React from 'react';
import { useCoinsByMoonPhase } from '@/lib/coinData';
import { Link } from 'wouter';
import { MoonPhase } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const MoonPhaseHeatmap: React.FC = () => {
  const { data: coinsByPhase, isLoading } = useCoinsByMoonPhase();
  
  const renderCoinsByPhase = (phase: MoonPhase) => {
    if (isLoading || !coinsByPhase) {
      return (
        <div className="flex flex-wrap gap-2">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-10 w-20 rounded-full" />
          ))}
        </div>
      );
    }
    
    const coins = coinsByPhase[phase] || [];
    
    if (coins.length === 0) {
      return (
        <div className="flex justify-center py-2">
          <span className="text-muted-foreground text-sm">Keine Coins in dieser Phase</span>
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {coins.map(coin => (
          <Link key={coin.id} href={`/coin/${coin.symbol}`}>
            <a className="px-4 py-2 bg-secondary rounded-full hover:bg-muted">
              {coin.symbol}
            </a>
          </Link>
        ))}
      </div>
    );
  };
  
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-8">MoonPhase Heatmap</h1>
      
      {/* Moon Phases */}
      <div className="space-y-6">
        {/* Neumond */}
        <div>
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-background rounded-full border border-muted-foreground mr-2"></div>
            <h3 className="text-lg font-medium">Neumond</h3>
          </div>
          
          {renderCoinsByPhase(MoonPhase.NEW_MOON)}
        </div>
        
        {/* Halbmond */}
        <div>
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-background rounded-full overflow-hidden mr-2">
              <div className="w-3 h-6 bg-muted-foreground"></div>
            </div>
            <h3 className="text-lg font-medium">Halbmond</h3>
          </div>
          
          {renderCoinsByPhase(MoonPhase.HALF_MOON)}
        </div>
        
        {/* Vollmond */}
        <div>
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-foreground rounded-full mr-2"></div>
            <h3 className="text-lg font-medium">Vollmond</h3>
          </div>
          
          {renderCoinsByPhase(MoonPhase.FULL_MOON)}
        </div>
      </div>
    </div>
  );
};

export default MoonPhaseHeatmap;
