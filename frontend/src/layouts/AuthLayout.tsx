import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc?: string;
  quote?: string;
  author?: string;
}

export const AuthLayout = ({ children, imageSrc, quote, author }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Contenedor Izquierdo - Imagen (Oculto en mviles) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src={imageSrc || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"} 
          alt="Travel background" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
        
        <div className="absolute top-8 left-12 text-white">
          <Link to="/" className="text-2xl font-extrabold tracking-tight hover:opacity-80 transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Travel Planner
          </Link>
        </div>

        <div className="absolute bottom-12 left-12 right-12 text-white">
          <blockquote className="text-3xl font-bold leading-tight mb-4 text-white drop-shadow-md">
            "{quote || 'Descubrí nuevos lugares y organizá tus viajes sin estrés.'}"
          </blockquote>
          {author && <p className="text-teal-300 font-semibold tracking-wide uppercase text-sm drop-shadow-sm">{author}</p>}
        </div>
      </div>

      {/* Contenedor Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 relative bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] overflow-hidden">
        
        {/* Textura sutil en el fondo */}
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Logo Mvil */}
        <Link to="/" className="lg:hidden absolute top-8 left-8 text-xl font-extrabold text-white flex items-center gap-2 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Travel Planner
        </Link>

        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
