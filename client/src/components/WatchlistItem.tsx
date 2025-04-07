import React from 'react';
import { Coin } from '@/types';
import { Link } from 'wouter';
import MoonPhase from './MoonPhase';
import { ChevronRight } from 'lucide-react';

interface WatchlistItemProps {
  coin: Coin;
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ coin }) => {
  return (
    <Link href={`/coin/${coin.symbol}`}>
      <a className="bg-secondary rounded-xl p-3 flex items-center justify-between hover:bg-muted cursor-pointer">
        <div className="flex items-center">
          <span className="text-lg font-medium">$ {coin.symbol}</span>
          <span className="ml-2">
            <MoonPhase phase={coin.moonPhase} />
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-4 text-sm">Details</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </a>
    </Link>
  );
};

export default WatchlistItem;
