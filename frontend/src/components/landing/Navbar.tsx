import { motion } from 'framer-motion';
import { Plane, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/useAuth';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-lg flex items-center justify-between px-6 py-3">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-coral-500 dark:text-coral-400 font-black text-xl tracking-tighter cursor-pointer">
          <Plane className="w-6 h-6" strokeWidth={2.5} />
          <span>yendiendo</span>
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
          
          {isAuthenticated ? (
            <Link
              to="/planificaciones"
              className="bg-coral-500 hover:bg-coral-600 text-white px-5 py-2 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-coral-500/30"
            >
              Mis Viajes
            </Link>
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
  );
}
