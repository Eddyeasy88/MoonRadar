import React from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { Home, PieChart, UserPlus, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const [location] = useLocation();
  const [isDashboard] = useRoute('/');
  const [isHeatmap] = useRoute('/heatmap');
  const [isInvite] = useRoute('/invite');
  const [isProfile] = useRoute('/profile');
  
  const getTabColor = (active: boolean) => 
    active ? "text-accent" : "text-muted-foreground";
    
  return (
    <div className="bg-background border-t border-border">
      <div className="grid grid-cols-4 py-2">
        <Link href="/">
          <a className={`flex flex-col items-center justify-center ${getTabColor(isDashboard)}`}>
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </a>
        </Link>
        
        <Link href="/heatmap">
          <a className={`flex flex-col items-center justify-center ${getTabColor(isHeatmap)}`}>
            <PieChart className="w-5 h-5 mb-1" />
            <span className="text-xs">Heatmap</span>
          </a>
        </Link>
        
        <Link href="/invite">
          <a className={`flex flex-col items-center justify-center ${getTabColor(isInvite)}`}>
            <UserPlus className="w-5 h-5 mb-1" />
            <span className="text-xs">Einladen</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`flex flex-col items-center justify-center ${getTabColor(isProfile)}`}>
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Profil</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
