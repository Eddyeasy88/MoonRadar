import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useCoinDetails } from '@/lib/coinData';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import MoonPhase from '@/components/MoonPhase';
import WhaleIndicator from '@/components/WhaleIndicator';
import { useToast } from "@/hooks/use-toast";

const ShareCoin: React.FC = () => {
  const { toast } = useToast();
  const [match, params] = useRoute('/share/:symbol');
  const symbol = params?.symbol?.toUpperCase() || '';
  
  const { data: coin, isLoading } = useCoinDetails(symbol);
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `https://moonradar.app/coin/${symbol}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: 'Link kopiert!',
      description: 'Der Link wurde in die Zwischenablage kopiert.',
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Schau dir ${symbol} auf MoonRadar an!`)}`, '_blank');
  };
  
  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Schau dir ${symbol} auf MoonRadar an! ${shareUrl}`)}`, '_blank');
  };
  
  if (isLoading || !coin) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center mb-6">
          <Link href={`/coin/${symbol}`}>
            <a className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Link>
          <h1 className="text-2xl font-bold flex-1 text-center">Teile den Moonshot</h1>
        </div>
        
        <Skeleton className="h-24 w-full rounded-xl mb-6" />
        <Skeleton className="h-12 w-full rounded-xl mb-4" />
        
        <div className="grid grid-cols-1 gap-3 mb-6">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/coin/${symbol}`}>
          <a className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </a>
        </Link>
        <h1 className="text-2xl font-bold flex-1 text-center">Teile den Moonshot</h1>
      </div>
      
      {/* Coin Info Card */}
      <div className="bg-secondary rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold">{coin.name} (${coin.symbol})</span>
          <div className="flex items-center space-x-2">
            <MoonPhase phase={coin.moonPhase} />
            <WhaleIndicator indicator={coin.whaleIndicator} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-accent">${coin.price.toFixed(3)}</span>
          <span className={`text-lg ${coin.priceChange24h > 0 ? 'text-accent' : 'text-red-500'}`}>
            {coin.priceChange24h > 0 ? '+' : ''}{coin.priceChange24h.toFixed(1)}%
          </span>
        </div>
      </div>
      
      {/* Share Link */}
      <div className="bg-secondary/50 rounded-xl p-3 mb-4 overflow-hidden">
        <span className="block text-sm text-muted-foreground truncate">
          {shareUrl}
        </span>
      </div>
      
      {/* Share Actions */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <Button 
          variant="outline"
          className="py-6 px-4 rounded-xl bg-secondary text-foreground font-medium flex items-center justify-center"
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4 mr-2" />
          {copied ? 'Kopiert!' : 'Link kopieren'}
        </Button>
        
        <Button
          variant="outline"
          className="py-6 px-4 rounded-xl bg-secondary text-foreground font-medium flex items-center justify-center"
          onClick={shareOnTelegram}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 18.274H6.106c-.663 0-1.215-.552-1.215-1.215V6.94c0-.663.552-1.215 1.215-1.215H7.8v4.714l1.84-1.84 1.84 1.84V5.725h6.414c.663 0 1.215.552 1.215 1.215v10.119c0 .663-.552 1.215-1.215 1.215z" />
          </svg>
          Telegram
        </Button>
        
        <Button
          variant="outline"
          className="py-6 px-4 rounded-xl bg-secondary text-foreground font-medium flex items-center justify-center"
          onClick={shareOnWhatsApp}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default ShareCoin;
