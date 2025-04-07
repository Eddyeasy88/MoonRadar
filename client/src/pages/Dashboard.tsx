import React from 'react';
import { useMoonshotOfMonth, useWatchlist, useCoinDetails } from '@/lib/coinData';
import FullMoon from '@/components/FullMoon';
import WatchlistItem from '@/components/WatchlistItem';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const { data: moonshot, isLoading: isMoonshotLoading } = useMoonshotOfMonth();
  const { data: watchlist, isLoading: isWatchlistLoading } = useWatchlist();
  
  // Fetch coin details for each watchlist item
  const watchlistCoins = React.useMemo(() => {
    if (!watchlist) return [];
    return watchlist.map(item => {
      const { data: coin } = useCoinDetails(item.coinSymbol);
      return coin;
    }).filter(Boolean);
  }, [watchlist]);
  
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-8 font-orbitron">MoonRadar</h1>
      
      {/* Moonshot of the Month */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Vollmond des Monats</h2>
        
        {isMoonshotLoading || !moonshot ? (
          <div className="relative w-full aspect-square max-w-xs mx-auto mb-4">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
        ) : (
          <FullMoon coin={moonshot} />
        )}
      </div>
      
      {/* My Watchlist */}
      <div>
        <h2 className="text-xl font-medium mb-4">Meine Watchlist</h2>
        
        {isWatchlistLoading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : watchlistCoins.length === 0 ? (
          <div className="bg-secondary rounded-xl p-6 text-center">
            <p className="text-muted-foreground">Deine Watchlist ist leer</p>
            <p className="text-sm text-muted-foreground mt-2">
              Füge Coins hinzu, um sie zu verfolgen
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlistCoins.map(coin => coin && (
              <WatchlistItem key={coin.id} coin={coin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
