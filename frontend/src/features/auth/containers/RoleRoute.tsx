import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface RoleRouteProps {
  requiredRole: string;
  redirectTo?: string;
}

export const RoleRoute = ({ requiredRole, redirectTo = '/' }: RoleRouteProps) => {
  const { hasRole, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(requiredRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
