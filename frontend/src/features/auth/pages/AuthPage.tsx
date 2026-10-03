import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { LoginForm } from '../containers/LoginForm';
import { RegisterForm } from '../containers/RegisterForm';

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

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {activeMode === 'login' ? (
          <motion.div
            key="login"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <LoginForm onFlipToSignup={() => handleModeChange('signup')} />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <RegisterForm onFlipToLogin={() => handleModeChange('login')} />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default AuthPage;
