import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const HomePage = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();
  const isAdmin = hasRole('ADMIN');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
          Bienvenido a <span className="text-teal-600">Travel Planner</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Organizá tus viajes de manera sencilla y eficiente. Creá planes, añadí
          destinos y gestioná tus actividades, todo en un solo lugar.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/planificaciones"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mis Planificaciones
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 border-2 border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Panel de Administración
              </Link>
            )}
          </>
        ) : (
          <>
            <Link
              to="/register"
              state={{ from: location }}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              state={{ from: location }}
              className="inline-flex items-center gap-2 border-2 border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
            >
              Iniciar sesión
            </Link>
          </>
        )}
      </div>
    </div>
  );
};