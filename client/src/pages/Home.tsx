import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import RadarLogo from '@/components/RadarLogo';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Add animation to the page when it loads
    document.body.classList.add('bg-background');
    
    return () => {
      document.body.classList.remove('bg-background');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <RadarLogo />
      
      <div className="w-full max-w-md space-y-6 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Kryptowährungen mit einzigartigem Mondphasen-System tracken
        </h2>
        
        <p className="text-muted-foreground">
          Entdecke den nächsten Moonshot und verstehe Marktbewegungen durch unser
          fortschrittliches Radar-System
        </p>
        
        <div className="flex flex-col gap-4 pt-4">
          <Button 
            className="w-full py-6 px-4 rounded-full bg-secondary border border-accent text-accent font-medium hover:bg-accent hover:text-background transition-colors"
            onClick={() => setLocation('/login')}
          >
            Einloggen
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full py-6 px-4 rounded-full bg-secondary text-foreground font-medium hover:bg-muted transition-colors"
            onClick={() => setLocation('/register')}
          >
            Registrieren
          </Button>
        </div>
        
        <div className="pt-4 flex items-center justify-center space-x-4 text-muted-foreground">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-foreground mr-2"></div>
            <span>Vollmond</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-5 h-5 bg-background rounded-full overflow-hidden mr-2">
              <div className="w-1/2 h-5 bg-muted-foreground"></div>
            </div>
            <span>Halbmond</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-5 h-5 bg-background rounded-full border border-muted-foreground mr-2"></div>
            <span>Neumond</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
