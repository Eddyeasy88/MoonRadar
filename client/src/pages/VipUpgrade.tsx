import React from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Ban, Bell, Star, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/lib/auth';

const VipUpgrade: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const upgradeToVip = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/vip/upgrade', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to upgrade to VIP');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: 'Upgrade erfolgreich!',
        description: 'Du bist jetzt MoonRadar VIP Mitglied.',
      });
      setLocation('/profile');
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler beim Upgrade',
        description: error.message || 'Bitte versuche es später erneut',
        variant: 'destructive',
      });
    }
  });
  
  return (
    <div className="px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/profile">
          <a className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </a>
        </Link>
        <h1 className="text-2xl font-bold flex-1 text-center">MoonRadar VIP</h1>
      </div>
      
      <h2 className="text-3xl font-bold text-accent text-center mb-8">Werde MoonRadar VIP</h2>
      
      {/* VIP Benefits */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mr-3">
            <Ban className="h-4 w-4 text-accent" />
          </div>
          <span>Keine Werbung</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mr-3">
            <Bell className="h-4 w-4 text-accent" />
          </div>
          <span>Unbegrenzte Alerts</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mr-3">
            <Star className="h-4 w-4 text-accent" />
          </div>
          <span>VIP-Modus</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mr-3">
            <List className="h-4 w-4 text-accent" />
          </div>
          <span>Benutzerdefinierte Watchlist</span>
        </div>
      </div>
      
      {/* Price */}
      <div className="text-center mb-6">
        <span className="text-2xl font-bold">0,99 €/Monat</span>
      </div>
      
      {/* Upgrade Button */}
      <Button 
        className="w-full py-6 px-4 rounded-xl bg-accent text-background font-medium mb-4"
        onClick={() => upgradeToVip.mutate()}
        disabled={upgradeToVip.isPending || user?.isVip}
      >
        {upgradeToVip.isPending ? 'Upgraden...' : 'Jetzt upgraden'}
      </Button>
      
      {/* Status */}
      {user?.isVip && (
        <div className="text-center text-muted-foreground">
          <span>Du bist bereits VIP</span>
        </div>
      )}
    </div>
  );
};

export default VipUpgrade;
