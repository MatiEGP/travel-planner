import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

interface RoleRouteProps {
  requiredRole: string;
  redirectTo?: string;
}

export const RoleRoute = ({ requiredRole, redirectTo = '/' }: RoleRouteProps) => {
  const { hasRole, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-500">Verificando permisos...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(requiredRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
