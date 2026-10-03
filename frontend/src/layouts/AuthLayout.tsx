import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface AuthLayoutProps {
  children: ReactNode;
  imageSrc?: string;
}

export const AuthLayout = ({
  children,
  imageSrc = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
}: AuthLayoutProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Absolute Header with Brand & Theme Toggle */}
      <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-4 sm:p-6 lg:p-8">
        <Link
          to="/"
          aria-label="Ir al menú principal"
          className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg transition-colors group"
        >
          <Compass className="w-6 h-6 text-[#FF5A5F] group-hover:rotate-45 transition-transform duration-300" />
          <span className="hidden sm:inline drop-shadow-md">Fuimonos</span>
        </Link>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="p-2.5 rounded-full backdrop-blur-md bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-800 dark:text-white md:text-white md:bg-black/40 md:hover:bg-black/60 transition-all shadow-sm"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Form Section (Full on mobile, 50% on desktop) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:w-1/2 md:flex-none">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Image Section (Hidden on mobile, 50% on desktop) */}
      <div className="hidden md:block relative w-1/2 bg-slate-100 dark:bg-slate-800">
        <img
          src={imageSrc}
          alt="Paisaje de viaje"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>
    </div>
  );
};
