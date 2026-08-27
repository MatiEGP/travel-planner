import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export interface AuthLayoutProps {
  children: ReactNode;
  imageSrc?: string;
  quote?: string;
  author?: string;
}

export const AuthLayout = ({
  children,
  imageSrc = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
}: AuthLayoutProps) => {
  return (
    <div
      data-testid="auth-layout"
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden overflow-x-hidden bg-slate-900"
    >
      {/* Top-Left Brand Link to Main Menu / Home */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-20">
        <Link
          to="/"
          aria-label="Ir al menú principal de Travel Planner"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold text-base sm:text-lg tracking-tight transition-all duration-200 hover:scale-105 shadow-lg group"
        >
          <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF5A5F] group-hover:rotate-45 transition-transform duration-300" />
          <span>Travel Planner</span>
        </Link>
      </div>
      {/* Background Image: Alpine Lake Scenery */}
      <div
        data-testid="auth-bg-image"
        className="fixed inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('${imageSrc}')`,
        }}
        aria-hidden="true"
      />

      {/* Dark Blur Overlay ensuring maximum readability & contrast for white cards */}
      <div
        className="fixed inset-0 z-0 bg-slate-950/40 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Centered container for child elements */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

