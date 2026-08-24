import React from 'react';
import DiscoveryNavbar from '../components/layout/DiscoveryNavbar';

interface DiscoveryLayoutProps {
  children: React.ReactNode;
}

const DiscoveryLayout: React.FC<DiscoveryLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-sand-50">
      <DiscoveryNavbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default DiscoveryLayout;
