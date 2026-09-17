import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { AnimatedAuthContainer } from '../containers/AnimatedAuthContainer';

export const AuthPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignupRoute = location.pathname === '/register' || location.pathname === '/registro';
  const activeMode: 'login' | 'signup' = isSignupRoute ? 'signup' : 'login';

  const handleModeChange = (mode: 'login' | 'signup') => {
    const targetPath = mode === 'signup' ? '/register' : '/login';
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true, state: location.state });
    }
  };

  return (
    <AuthLayout>
      <AnimatedAuthContainer
        activeMode={activeMode}
        onModeChange={handleModeChange}
      />
    </AuthLayout>
  );
};

export default AuthPage;
