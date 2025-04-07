import React from 'react';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateSettings = useMutation({
    mutationFn: async (settings: Partial<User>) => {
      const res = await fetch('/api/users/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to update settings');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: 'Einstellungen aktualisiert',
        description: 'Deine Einstellungen wurden erfolgreich gespeichert',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler',
        description: error.message || 'Einstellungen konnten nicht aktualisiert werden',
        variant: 'destructive',
      });
    }
  });
  
  const handleToggleDarkMode = () => {
    if (!user) return;
    updateSettings.mutate({ darkMode: !user.darkMode });
  };
  
  const handleToggleNotifications = () => {
    if (!user) return;
    updateSettings.mutate({ notifications: !user.notifications });
  };
  
  if (!user) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-8">Profil</h1>
        
        <div className="flex flex-col items-center mb-8">
          <Skeleton className="w-20 h-20 rounded-full mb-2" />
          <Skeleton className="h-6 w-40" />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">VIP-Status</h3>
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Einstellungen</h3>
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-8">Profil</h1>
      
      {/* Profile Info */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-2">
          <UserIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <span className="text-lg">{user.email}</span>
      </div>
      
      {/* VIP Status */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">VIP-Status</h3>
        <div className="bg-secondary rounded-xl p-4 flex items-center justify-between">
          <span>{user.isVip ? 'Aktiv' : 'Nicht aktiv'}</span>
          <Link href="/vip">
            <Button className="py-1 px-4 rounded-full bg-accent text-background font-medium text-sm">
              {user.isVip ? 'Verlängern' : 'Upgrade'}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Einstellungen</h3>
        <div className="bg-secondary rounded-xl overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-background">
            <span>Darkmode</span>
            <Switch 
              checked={user.darkMode}
              onCheckedChange={handleToggleDarkMode}
              disabled={updateSettings.isPending}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <span>Benachrichtigungen</span>
            <Switch 
              checked={user.notifications}
              onCheckedChange={handleToggleNotifications}
              disabled={updateSettings.isPending}
            />
          </div>
        </div>
      </div>
      
      {/* Logout Button */}
      <Button 
        variant="outline"
        className="w-full py-6 px-4 rounded-xl bg-secondary text-foreground font-medium"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
      >
        {logout.isPending ? 'Bitte warten...' : 'Abmelden'}
      </Button>
    </div>
  );
};

export default Profile;
