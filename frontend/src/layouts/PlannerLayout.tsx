import React from 'react';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

interface PlannerLayoutProps {
  children: React.ReactNode;
  onNewTrip?: () => void;
}

const PlannerLayout: React.FC<PlannerLayoutProps> = ({ children, onNewTrip }) => {
  return (
    <div 
      className="flex flex-1 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #204060 0%, #122842 50%, #071321 100%)' }}
    >
      {/* Textura de Olas */}
      <div 
        className="absolute inset-0 bg-repeat opacity-40 pointer-events-none mix-blend-overlay z-0"
        style={{ backgroundImage: "url('/waves.svg')", backgroundSize: '100px 40px' }}
      />
      
      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto z-10 relative">
        <ErrorBoundary>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </ErrorBoundary>
      </main>
      
      {/* Optional Right Aside (Quick Actions) */}
      <aside className="w-80 bg-slate-900/40 backdrop-blur-md border-l border-slate-700/50 shadow-xl hidden lg:block p-6 z-10">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Panel Rápido
        </h3>
        
        <button 
          onClick={onNewTrip}
          className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl transition-all shadow-md hover:shadow-teal-500/25 hover:-translate-y-0.5 flex justify-center items-center gap-2 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Viaje
        </button>
      </aside>
    </div>
  );
};

export default PlannerLayout;
