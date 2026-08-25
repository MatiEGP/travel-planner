import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const PlannerSidebar: React.FC = () => {
  const location = useLocation();
  const { logout, usuario } = useAuth();
  
  const isPlans = location.pathname.includes('/planificaciones');

  return (
    <aside className="w-64 bg-slate-900/40 backdrop-blur-md border-r border-slate-700/50 h-screen sticky top-0 flex flex-col z-20 shadow-xl">
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-white hover:opacity-80 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Travel Planner
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link 
          to="/" 
          className="block px-4 py-2.5 text-slate-300 font-medium hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors"
        >
          Inicio
        </Link>
        <Link 
          to="/planificaciones" 
          className={`block px-4 py-2.5 font-semibold rounded-xl transition-colors ${
            isPlans 
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
              : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
          }`}
        >
          Mis Planes
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-600/50 flex flex-col gap-2">
          <span className="text-sm font-semibold text-white truncate" title={usuario?.email}>{usuario?.email}</span>
          <button 
            onClick={logout}
            className="text-xs text-slate-400 hover:text-rose-400 text-left transition-colors font-medium flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PlannerSidebar;
