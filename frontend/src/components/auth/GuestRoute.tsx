import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

/**
 * Route guard para rutas de acceso exclusivo para invitados (usuarios no autenticados).
 * Si el usuario ya está autenticado, lo redirige automáticamente a /planificaciones
 * o a la ruta previa de donde venía.
 */
export const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-500">Cargando sesión...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/planificaciones';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};
