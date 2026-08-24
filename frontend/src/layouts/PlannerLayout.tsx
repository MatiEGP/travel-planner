import React from 'react';
import PlannerSidebar from '../components/layout/PlannerSidebar';

interface PlannerLayoutProps {
  children: React.ReactNode;
}

const PlannerLayout: React.FC<PlannerLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-sand-50">
      <PlannerSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <aside className="w-80 bg-white shadow-soft h-screen sticky top-0 hidden lg:block p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <button className="w-full py-2 px-4 bg-nature-500 text-white rounded-organic hover:bg-nature-900 transition-colors">
          Create New Plan
        </button>
      </aside>
    </div>
  );
};

export default PlannerLayout;
