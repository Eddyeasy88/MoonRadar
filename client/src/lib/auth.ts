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
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await apiRequest('POST', '/api/auth/login', { username, password });
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
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error(`Logout fehlgeschlagen: ${res.status}`);
        }
        
        // Zusätzlich: Clientseitige Session-Cookies löschen
        document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        return await res.json();
      } catch (error) {
        console.error("Logout error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Logout erfolgreich");
      // Den Cache zurücksetzen
      queryClient.resetQueries();
      queryClient.setQueryData(['/api/auth/me'], null);
      
      // Umleitung erzwingen
      window.location.href = '/login';
      
      toast({
        title: 'Ausgeloggt',
        description: 'Du wurdest erfolgreich ausgeloggt',
      });
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
      toast({
        title: 'Fehler beim Ausloggen',
        description: error.message || 'Abmeldung fehlgeschlagen',
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
