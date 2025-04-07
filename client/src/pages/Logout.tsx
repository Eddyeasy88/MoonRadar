import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Redirect } from 'wouter';

const Logout: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Beim Laden der Komponente ausloggen
    if (isAuthenticated) {
      console.log("Logging out automatically");
      logout.mutate();
      
      // Cookies manuell löschen
      document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Direkt nach dem Rendern auch den TanStack Query Cache über localStorage löschen
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/login';
      }, 100);
    }
  }, [logout, isAuthenticated]);
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-2 border-accent rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg">Abmeldung läuft...</p>
      </div>
    </div>
  );
};

export default Logout;