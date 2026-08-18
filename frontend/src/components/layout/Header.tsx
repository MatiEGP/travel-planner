import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export const Header = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-teal-900 text-white'
        : 'text-teal-100 hover:bg-teal-700 hover:text-white'
    }`;

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/login');
  };

  const isAdmin = hasRole('ADMIN');

  return (
    <>
      <header className="bg-teal-800 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Travel Planner
            </Link>

            <div className="flex items-center gap-6">
              <div className="flex space-x-2">
                <NavLink to="/" className={getNavLinkClass} end>Inicio</NavLink>
                {isAuthenticated && (
                  <NavLink to="/planificaciones" className={getNavLinkClass}>Planificaciones</NavLink>
                )}
                {isAuthenticated && isAdmin && (
                  <NavLink to="/admin" className={getNavLinkClass}>Admin</NavLink>
                )}
              </div>

              {isAuthenticated && user ? (
                <div className="flex items-center gap-3 border-l border-teal-600 pl-4">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-white text-sm font-bold">
                      {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>

                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-white text-sm font-medium">{user.nombre}</span>
                    <span className="text-[11px] text-teal-200 font-semibold tracking-wider uppercase">
                      {isAdmin ? 'Admin' : 'Cliente'}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="ml-2 text-teal-200 hover:text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-teal-700 hover:bg-teal-600 transition-colors duration-200 flex items-center gap-1.5"
                    title="Cerrar sesión"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden md:inline">Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 border-l border-teal-600 pl-4">
                  <Link
                    to="/login"
                    className="text-teal-100 hover:text-white text-sm font-medium transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium py-1.5 px-3.5 rounded-lg transition-colors shadow-sm"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center text-slate-800 mb-2">¿Cerrar sesión?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Tendrás que volver a ingresar tus credenciales para acceder a tus itinerarios.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 px-4 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors"
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