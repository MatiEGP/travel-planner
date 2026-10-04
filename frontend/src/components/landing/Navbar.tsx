import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Moon, Sun, LogOut, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/useAuth';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-lg flex items-center justify-between px-6 py-3">
          
          {/* Logo */}
          <motion.button 
            onClick={handleLogoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-coral-500 dark:text-coral-400 font-black text-xl tracking-tighter cursor-pointer hover:opacity-90 transition-opacity"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
            >
              <Compass className="w-6 h-6" strokeWidth={2.5} />
            </motion.div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral-500 to-ocean-500">Fuimonos</span>
          </motion.button>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/planificaciones"
                  className="bg-coral-500 hover:bg-coral-600 text-white px-5 py-2 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-coral-500/30"
                >
                  Mis Viajes
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="p-2 text-slate-500 hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                state={{ from: location }}
                className="bg-coral-500 hover:bg-coral-600 text-white px-5 py-2 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-coral-500/30"
              >
                Ingresar
              </Link>
            )}
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
}
