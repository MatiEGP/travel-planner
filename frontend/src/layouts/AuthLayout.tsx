import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc?: string;
  quote?: string;
  author?: string;
}

export const AuthLayout = ({ children, imageSrc, quote, author }: AuthLayoutProps) => {
  return (
    <div className="flex flex-1 w-full bg-white relative">
      {/* Contenedor Izquierdo - Imagen (Oculto en móviles) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src={imageSrc || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"} 
          alt="Travel background" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* Gradiente inferior para contraste de la cita */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none" />

        <div className="absolute bottom-12 left-12 right-12 text-white z-10">
          <blockquote className="text-3xl font-bold leading-tight mb-4 text-white drop-shadow-md">
            "{quote || 'Descubrí nuevos lugares y organizá tus viajes sin estrés.'}"
          </blockquote>
          {author && <p className="text-teal-300 font-semibold tracking-wide uppercase text-sm drop-shadow-sm">{author}</p>}
        </div>
      </div>

      {/* Contenedor Derecho - Formulario */}
      <div 
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at center, #204060 0%, #122842 50%, #071321 100%)' }}
      >
        {/* Textura de Olas */}
        <div 
          className="absolute inset-0 bg-repeat opacity-40 pointer-events-none mix-blend-overlay z-0"
          style={{ backgroundImage: "url('/waves.svg')", backgroundSize: '100px 40px' }}
        />

        <div className="w-full max-w-md mx-auto relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
