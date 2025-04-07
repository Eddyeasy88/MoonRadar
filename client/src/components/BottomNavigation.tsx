import React from 'react';
import { useLocation, useRoute } from 'wouter';
import { Home, PieChart, UserPlus, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [isDashboard] = useRoute('/');
  const [isHeatmap] = useRoute('/heatmap');
  const [isInvite] = useRoute('/invite');
  const [isProfile] = useRoute('/profile');
  
  const getTabColor = (active: boolean) => 
    active ? "text-accent" : "text-muted-foreground";
    
  const navigateTo = (path: string) => {
    setLocation(path);
  };
    
  return (
    <div className="bg-background border-t border-border">
      <div className="grid grid-cols-4 py-2">
        <button 
          onClick={() => navigateTo('/')}
          className={`flex flex-col items-center justify-center ${getTabColor(isDashboard)}`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs">Home</span>
        </button>
        
        <button 
          onClick={() => navigateTo('/heatmap')}
          className={`flex flex-col items-center justify-center ${getTabColor(isHeatmap)}`}
        >
          <PieChart className="w-5 h-5 mb-1" />
          <span className="text-xs">Heatmap</span>
        </button>
        
        <button 
          onClick={() => navigateTo('/invite')}
          className={`flex flex-col items-center justify-center ${getTabColor(isInvite)}`}
        >
          <UserPlus className="w-5 h-5 mb-1" />
          <span className="text-xs">Einladen</span>
        </button>
        
        <button 
          onClick={() => navigateTo('/profile')}
          className={`flex flex-col items-center justify-center ${getTabColor(isProfile)}`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">Profil</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
