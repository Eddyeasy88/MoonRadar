import React from 'react';
import { useRoute, Link } from 'wouter';
import { useCoinDetails, useCoinInWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '@/lib/coinData';
import CryptoStats from '@/components/CryptoStats';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Share2, 
  ExternalLink,
  Plus,
  Minus
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CoinDetail: React.FC = () => {
  const [match, params] = useRoute('/coin/:symbol');
  const symbol = params?.symbol?.toUpperCase() || '';
  
  const { data: coin, isLoading } = useCoinDetails(symbol);
  const isInWatchlist = useCoinInWatchlist(coin?.id || '');
  
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  
  const handleToggleWatchlist = () => {
    if (!coin) return;
    
    if (isInWatchlist) {
      removeFromWatchlist.mutate(coin.id);
    } else {
      addToWatchlist.mutate({ 
        coinId: coin.id,
        coinSymbol: coin.symbol
      });
    }
  };
  
  if (isLoading || !coin) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center mb-6">
          <Link href="/">
            <a className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Link>
          <Skeleton className="h-8 w-48 flex-1" />
          <Skeleton className="h-6 w-6" />
        </div>
        
        <Skeleton className="h-40 w-full rounded-xl mb-6" />
        <Skeleton className="h-48 w-full rounded-xl mb-6" />
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <Link href="/">
          <a className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </a>
        </Link>
        <h1 className="text-2xl font-bold flex-1 text-center">
          {coin.name} (${coin.symbol})
        </h1>
        <Link href={`/share/${coin.symbol}`}>
          <a>
            <Share2 className="h-5 w-5" />
          </a>
        </Link>
      </div>
      
      {/* Coin Stats */}
      <CryptoStats coin={coin} />
      
      {/* Chart Placeholder */}
      <div className="bg-secondary rounded-xl p-4 h-48 mb-6 flex items-center justify-center mt-6">
        <div className="text-muted-foreground text-center">
          <div className="mb-2">Chart View</div>
          <div className="text-xs">(via DexScreener API)</div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button 
          variant="outline" 
          className="py-6 px-4 rounded-xl bg-secondary border border-accent text-accent font-medium hover:bg-accent hover:text-background"
          onClick={() => window.open(`https://dexscreener.com/search?q=${coin.symbol}`, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Chart extern ansehen
        </Button>
        
        <Button
          variant="outline"
          className="py-6 px-4 rounded-xl bg-secondary text-foreground font-medium"
          onClick={handleToggleWatchlist}
          disabled={addToWatchlist.isPending || removeFromWatchlist.isPending}
        >
          {isInWatchlist ? (
            <>
              <Minus className="h-4 w-4 mr-2" />
              Von Watchlist entfernen
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Zur Watchlist hinzufügen
            </>
          )}
        </Button>
      </div>
      
      {/* Social Stats */}
      <div className="bg-secondary rounded-xl p-4">
        <h3 className="text-lg font-medium mb-3">Social Activity</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <svg className="w-6 h-6 mx-auto mb-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 18.274H6.106c-.663 0-1.215-.552-1.215-1.215V6.94c0-.663.552-1.215 1.215-1.215H7.8v4.714l1.84-1.84 1.84 1.84V5.725h6.414c.663 0 1.215.552 1.215 1.215v10.119c0 .663-.552 1.215-1.215 1.215z" />
            </svg>
            <span className="block text-sm">12.5K</span>
          </div>
          <div>
            <svg className="w-6 h-6 mx-auto mb-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            <span className="block text-sm">8.2K</span>
          </div>
          <div>
            <svg className="w-6 h-6 mx-auto mb-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm10.333 12c0 5.731-4.602 10.333-10.333 10.333S1.667 17.731 1.667 12 6.269 1.667 12 1.667 22.333 6.269 22.333 12zM12 4.333c-4.387 0-7.667 3.28-7.667 7.667s3.28 7.667 7.667 7.667 7.667-3.28 7.667-7.667S16.387 4.333 12 4.333z" />
              <circle cx="12" cy="12" r="1.5" />
              <path d="M17.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 15a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
            </svg>
            <span className="block text-sm">Website</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
