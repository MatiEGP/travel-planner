// ============================================================================
// Page Component: HomePage
// Modernized landing page adhering to the Wanderlog light palette (#F7F9FA),
// featuring a welcoming hero banner, action CTAs, and feature preview cards.
// ============================================================================

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';
import DiscoveryLayout from '../../../layouts/DiscoveryLayout';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <DiscoveryLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
            Planificá tus viajes con <span className="text-coral-500">Travel</span> <span className="text-coral-600">Planner</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Organizá tus aventuras de manera sencilla y visual. Creá itinerarios completos,
            añadí destinos y gestioná tus actividades en una sola plataforma.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {isAuthenticated ? (
            <Link
              to="/planificaciones"
              className="inline-flex items-center gap-2 bg-coral-500 hover:bg-coral-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md shadow-coral-500/20 hover:shadow-lg hover:shadow-coral-500/30 hover:-translate-y-0.5 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mis Planificaciones
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                state={{ from: location }}
                className="inline-flex items-center gap-2 bg-coral-500 hover:bg-coral-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md shadow-coral-500/20 hover:shadow-lg hover:shadow-coral-500/30 hover:-translate-y-0.5 cursor-pointer"
              >
                Registrarse
              </Link>
              <Link
                to="/login"
                state={{ from: location }}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-xs hover:-translate-y-0.5 cursor-pointer"
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Itinerarios Día a Día</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Estructurá cada día de tu viaje con horarios, notas y paradas esenciales.
            </p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Destinos y Actividades</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Explorá y organizá puntos de interés, visitas guiadas y atracciones favoritas.
            </p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Gastos y Presupuesto</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Mantené el control de tus finanzas durante el viaje en tiempo real y sin sorpresas.
            </p>
          </div>
        </div>
      </div>
    </DiscoveryLayout>
  );
};

