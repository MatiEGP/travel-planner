import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/useAuth';

export const Header = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors duration-200 px-3 py-2 rounded-xl ${
      isActive
        ? 'bg-teal-500/20 text-teal-300'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
    }`;

  const getAuthNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors duration-200 px-3 py-2 rounded-xl ${
      isActive
        ? 'bg-teal-500/20 text-teal-300'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
    }`;

  const getRegisterNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold py-2 px-4 rounded-xl transition-all duration-200 shadow-md ${
      isActive
        ? 'bg-teal-500 text-slate-900 shadow-teal-500/25'
        : 'bg-teal-500 hover:bg-teal-400 text-slate-900 hover:shadow-teal-500/25'
    }`;

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/login');
  };

  const isAdmin = hasRole('ADMIN');

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-900/60 backdrop-blur-md border-b border-slate-700/50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo a la izquierda */}
            <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Travel Planner
            </Link>

            {/* Navegación y Perfil a la derecha */}
            <div className="flex items-center gap-6">
              
              {/* Rutas (Izquierda del perfil) - Solo si hay sesión */}
              {isAuthenticated && (
                <div className="flex space-x-2">
                  <NavLink to="/" className={getNavLinkClass} end>Inicio</NavLink>
                  <NavLink to="/planificaciones" className={getNavLinkClass}>Planificaciones</NavLink>
                  {isAdmin && (
                    <NavLink to="/admin" className={getNavLinkClass}>Admin</NavLink>
                  )}
                </div>
              )}

              {/* Perfil o Botones de Auth (Derecha del todo) */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-4 pl-6 border-l border-slate-700/50">
                  <div className="hidden sm:flex flex-col items-end leading-tight">
                    <span className="text-white text-sm font-medium">{user.nombre || user.email}</span>
                    <span className="text-[11px] text-teal-400 font-bold tracking-wider uppercase">
                      {isAdmin ? 'Admin' : 'Cliente'}
                    </span>
                  </div>

                  <div className="w-9 h-9 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-teal-400 text-sm font-bold">
                      {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="ml-2 text-slate-400 hover:text-rose-400 text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
                    title="Cerrar sesión"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden md:inline">Salir</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-2">
                  <NavLink
                    to="/login"
                    state={{ from: location }}
                    className={getAuthNavLinkClass}
                    end
                  >
                    Iniciar sesión
                  </NavLink>
                  <NavLink
                    to="/register"
                    state={{ from: location }}
                    className={getRegisterNavLinkClass}
                    end
                  >
                    Registrarse
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Logout confirmation modal (Actualizado al nuevo estilo) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div className="relative bg-slate-800 border border-slate-600 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-rose-900/20">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-white mb-2">¿Cerrar sesión?</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              Tendrás que volver a ingresar tus credenciales para acceder a tus itinerarios.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-900/20"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
