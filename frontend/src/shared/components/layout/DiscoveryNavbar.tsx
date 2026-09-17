import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/useAuth';

const DiscoveryNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isAuthenticated, user, usuario, logout } = useAuth();
  const currentUser = user || usuario;

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}
      data-testid="discovery-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/">
              <span className="text-xl font-bold text-slate-800">
                Travel Planner
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/planificaciones" className="font-medium text-slate-600 hover:text-teal-600 transition">
              Planner
            </Link>
            
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-4">
                <Link to="/login" className="font-medium text-slate-600 hover:text-teal-600 transition">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition shadow-sm font-medium">
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-5 ml-4 relative">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 overflow-hidden shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-slate-700">
                    {currentUser?.nombre || 'Usuario'}
                  </span>
                </div>

                <div className="relative flex items-center">
                  <button 
                    onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
                    className="text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-500 hover:border-red-200 px-3 py-1.5 rounded-lg transition"
                  >
                    Cerrar sesión
                  </button>

                  {showLogoutConfirm && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-3 px-4 z-50 border border-slate-100">
                      <p className="text-sm text-slate-700 mb-3 text-center font-medium">¿Cerrar sesión?</p>
                      <div className="flex justify-between space-x-2">
                        <button 
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 px-2 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                        >
                          No
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition shadow-sm"
                        >
                          Sí, salir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DiscoveryNavbar;
