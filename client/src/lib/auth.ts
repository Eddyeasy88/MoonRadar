import { User } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './queryClient';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';

export const useAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['/api/auth/me'],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          throw new Error(`${res.status}: ${await res.text() || res.statusText}`);
        }
        
        return res.json();
      } catch (error) {
        console.error("Auth query error:", error);
        return null;
      }
    },
  });
  
  const login = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await apiRequest('POST', '/api/auth/login', { email, password });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login fehlgeschlagen');
      }
      return res.json();
    },
    onSuccess: (data) => {
      // Erst die Daten in den Cache setzen
      queryClient.setQueryData(['/api/auth/me'], data);
      
      // Dann zur Dashboard-Seite weiterleiten
      setTimeout(() => {
        console.log('Weiterleitung nach erfolgreicher Anmeldung');
        setLocation('/');
      }, 100);
      
      toast({
        title: 'Erfolgreich eingeloggt',
        description: 'Willkommen zurück bei MoonRadar',
      });
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast({
        title: 'Login fehlgeschlagen',
        description: error.message || 'Bitte überprüfe deine Eingaben',
        variant: 'destructive',
      });
    }
  });
  
  const register = useMutation({
    mutationFn: async ({ username, email, password }: { username: string; email: string; password: string }) => {
      const res = await apiRequest('POST', '/api/auth/register', { 
        username, 
        email, 
        password,
        referralCode: '', // Wir senden einen leeren String mit, wird vom Server überschrieben
        referredBy: null // Optional, wird null sein
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registrierung fehlgeschlagen');
      }
      
      return res.json();
    },
    onSuccess: () => {
      setLocation('/login');
      toast({
        title: 'Registration erfolgreich',
        description: 'Du kannst dich jetzt einloggen',
      });
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      toast({
        title: 'Registration fehlgeschlagen',
        description: error.message || 'Bitte überprüfe deine Eingaben',
        variant: 'destructive',
      });
    }
  });
  
  const logout = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/auth/logout', {});
      return res.json();
    },
    onSuccess: () => {
      // Den Cache zurücksetzen
      queryClient.setQueryData(['/api/auth/me'], null);
      setLocation('/login');
      toast({
        title: 'Ausgeloggt',
        description: 'Du wurdest erfolgreich ausgeloggt',
      });
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
      toast({
        title: 'Fehler beim Ausloggen',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
};
