import React, { ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
