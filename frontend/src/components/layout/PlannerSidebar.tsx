import React from 'react';
import { Link } from 'react-router-dom';

const PlannerSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow-soft h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">Travel Planner</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-nature-50 hover:text-nature-900 rounded-organic transition-colors">
          Discovery
        </Link>
        <Link to="/planificaciones" className="block px-4 py-2 text-gray-700 bg-nature-50 text-nature-900 rounded-organic transition-colors">
          My Plans
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          User Account
        </div>
      </div>
    </aside>
  );
};

export default PlannerSidebar;
