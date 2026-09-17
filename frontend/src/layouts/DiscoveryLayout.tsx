import React from 'react';

interface DiscoveryLayoutProps {
  children: React.ReactNode;
}

const DiscoveryLayout: React.FC<DiscoveryLayoutProps> = ({ children }) => {
  return (
    <div className="flex-1 bg-sand-50">
      <main className="h-full">
        {children}
      </main>
    </div>
  );
};

export default DiscoveryLayout;
