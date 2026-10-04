import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/**
 * Route guard para rutas de acceso exclusivo para invitados (usuarios no autenticados).
 * Si el usuario ya está autenticado, lo redirige automáticamente a /planificaciones
 * o a la ruta previa de donde venía.
 */
export const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    const rawFrom = (location.state as { from?: { pathname?: string; search?: string; hash?: string } | string })?.from;
    let dest = '/';
    if (typeof rawFrom === 'string') {
      dest = ['/login', '/register', '/registro'].includes(rawFrom) ? '/' : rawFrom;
    } else if (rawFrom && typeof rawFrom === 'object') {
      const path = `${rawFrom.pathname || ''}${rawFrom.search || ''}${rawFrom.hash || ''}`;
      dest = (!path || ['/login', '/register', '/registro'].includes(rawFrom.pathname || '')) ? '/' : path;
    }
    return <Navigate to={dest} replace />;
  }

  return <Outlet />;
};
