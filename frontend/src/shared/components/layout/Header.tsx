import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Moon, Sun, LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../features/auth/context/useAuth';
import { useTheme } from '../../../context/ThemeContext';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold transition-all duration-200 px-4 py-2 rounded-xl ${
      isActive
        ? 'bg-coral-500/10 text-coral-600 dark:bg-coral-500/20 dark:text-coral-400'
        : 'text-slate-600 dark:text-slate-400 hover:text-coral-500 dark:hover:text-coral-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const getAuthNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors duration-200 px-4 py-2 rounded-xl ${
      isActive
        ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const getRegisterNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold py-2 px-5 rounded-xl transition-all duration-200 shadow-md ${
      isActive
        ? 'bg-coral-600 text-white shadow-coral-500/25'
        : 'bg-coral-500 hover:bg-coral-600 text-white shadow-coral-500/25 hover:scale-105 active:scale-95'
    }`;

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/login');
  };

  const isUserAdmin = user?.roles?.some((r) => r === 'ROLE_ADMIN' || r === 'ADMIN');

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="sticky top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4"
      >
        <div className="max-w-7xl mx-auto bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-lg shadow-slate-200/20 dark:shadow-slate-900/50 flex items-center justify-between px-6 py-3">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-800 dark:text-white font-black text-xl tracking-tighter hover:opacity-90 transition-opacity"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <Compass className="w-6 h-6 text-coral-500 dark:text-coral-400" strokeWidth={2.5} />
              <span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral-500 to-ocean-500">Fuimonos</span>
              </span>
            </motion.div>
          </Link>

          {/* Navigation and User Identity Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Links and User Auth */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden md:flex items-center gap-2 mr-2">
                    <NavLink to="/" className={getNavLinkClass} end>Inicio</NavLink>
                    <NavLink to="/planificaciones" className={getNavLinkClass}>Planificaciones</NavLink>
                  </div>

                  {user && (
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1" />
                      
                      <div className="hidden lg:flex flex-col items-end leading-tight">
                        <span className="text-slate-800 dark:text-white text-sm font-bold">{user.nombre || user.email}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">
                          {isUserAdmin ? 'Admin' : 'Aventurero'}
                        </span>
                      </div>

                      <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-extrabold">
                          {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-all duration-200 cursor-pointer"
                        title="Cerrar sesión"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <NavLink
                    to="/login"
                    state={{ from: location }}
                    className={getAuthNavLinkClass}
                    end
                  >
                    Ingresar
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
        </div>
      </motion.nav>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10"
            >
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                ¿Cerrar sesión?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                Vas a tener que volver a ingresar tus credenciales para acceder a tus itinerarios.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-500/20 cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

