import { Coin, MoonPhase, WhaleIndicator, WatchlistItem } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './queryClient';
import { useToast } from "@/hooks/use-toast";

// Mock data to simulate API responses
const calculateWhaleIndicator = (percentage: number): WhaleIndicator => {
  if (percentage < 5) return WhaleIndicator.ROCKET;
  if (percentage < 10) return WhaleIndicator.DYNAMITE;
  return WhaleIndicator.BOMB;
};

// Get All Coins by Moon Phase
export const useCoinsByMoonPhase = () => {
  return useQuery<{[key in MoonPhase]: Coin[]}>({
    queryKey: ['/api/coins/by-phase'],
  });
};

// Get Moonshot of the Month
export const useMoonshotOfMonth = () => {
  return useQuery<Coin>({
    queryKey: ['/api/coins/moonshot'],
  });
};

// Get Coin Details
export const useCoinDetails = (symbol: string) => {
  return useQuery<Coin>({
    queryKey: [`/api/coins/${symbol}`],
    enabled: !!symbol,
  });
};

// Get User Watchlist
export const useWatchlist = () => {
  return useQuery<WatchlistItem[]>({
    queryKey: ['/api/watchlist'],
  });
};

// Add Coin to Watchlist
export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ coinId, coinSymbol }: { coinId: string; coinSymbol: string }) => {
      const res = await apiRequest('POST', '/api/watchlist', { coinId, coinSymbol });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
      toast({
        title: 'Coin hinzugefügt',
        description: 'Der Coin wurde zu deiner Watchlist hinzugefügt',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler',
        description: error.message || 'Coin konnte nicht hinzugefügt werden',
        variant: 'destructive',
      });
    }
  });
};

// Remove Coin from Watchlist
export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (coinId: string) => {
      const res = await apiRequest('DELETE', `/api/watchlist/${coinId}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
      toast({
        title: 'Coin entfernt',
        description: 'Der Coin wurde aus deiner Watchlist entfernt',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler',
        description: error.message || 'Coin konnte nicht entfernt werden',
        variant: 'destructive',
      });
    }
  });
};

// Check if a coin is in user's watchlist
export const useCoinInWatchlist = (coinId: string) => {
  const { data: watchlist } = useWatchlist();
  const isInWatchlist = !!watchlist?.find(item => item.coinId === coinId);
  return isInWatchlist;
};
