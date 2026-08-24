import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-soft' : 'bg-transparent'
      }`}
      data-testid="discovery-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/">
              <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                Travel Planner
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/planificaciones" className={`hover:text-ocean-500 ${isScrolled ? 'text-gray-600' : 'text-gray-200'}`}>
              Planner
            </Link>
            
            {!isAuthenticated ? (
              <>
                <Link to="/login" className={`hover:text-ocean-500 font-medium ${isScrolled ? 'text-gray-600' : 'text-gray-200'}`}>
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="bg-ocean-600 text-white px-4 py-2 rounded-md hover:bg-ocean-700 transition font-medium">
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4 relative">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${isScrolled ? 'bg-gray-100 text-gray-500' : 'bg-white/20 text-white'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                    {currentUser?.nombre || 'Usuario'}
                  </span>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
                    className={`text-sm font-medium hover:text-red-500 transition ${isScrolled ? 'text-gray-500' : 'text-gray-300'}`}
                  >
                    Cerrar sesión
                  </button>

                  {showLogoutConfirm && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-3 px-4 z-50 border border-gray-100">
                      <p className="text-sm text-gray-700 mb-3 text-center font-medium">¿Cerrar sesión?</p>
                      <div className="flex justify-between space-x-2">
                        <button 
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition"
                        >
                          No
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded transition"
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
