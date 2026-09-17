import { useState, useEffect, type FC } from 'react';
import { LoginFormCard } from './LoginFormCard';
import { RegisterFormCard } from './RegisterFormCard';

export interface AnimatedAuthContainerProps {
  activeMode?: 'login' | 'signup';
  onModeChange?: (mode: 'login' | 'signup') => void;
}

export const AnimatedAuthContainer: FC<AnimatedAuthContainerProps> = ({
  activeMode = 'login',
  onModeChange,
}) => {
  const [currentMode, setCurrentMode] = useState<'login' | 'signup'>(activeMode);
  const [prevActiveMode, setPrevActiveMode] = useState(activeMode);

  if (activeMode !== prevActiveMode) {
    setPrevActiveMode(activeMode);
    setCurrentMode(activeMode);
  }

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if (mediaQuery.addListener) {
      // Compatibility for older browser environments / testing mocks
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    if (newMode === currentMode) return;
    setCurrentMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    } else if (typeof window !== 'undefined') {
      const targetPath = newMode === 'login' ? '/login' : '/register';
      if (window.location.pathname !== targetPath) {
        window.history.replaceState(null, '', targetPath);
      }
    }
  };

  const isLogin = currentMode === 'login';

  return (
    <div
      className="relative w-full max-w-md mx-auto min-h-[670px] flex items-center justify-center py-6"
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      {/* Login Card 3D Layer */}
      <div
        data-testid="auth-card-login"
        onClick={() => !isLogin && handleModeSwitch('login')}
        style={
          prefersReducedMotion
            ? {
                opacity: isLogin ? 1 : 0,
                pointerEvents: isLogin ? 'auto' : 'none',
                zIndex: isLogin ? 20 : 10,
                transform: 'none',
                filter: 'none',
                transition: 'opacity 0.25s ease-in-out',
              }
            : {
                transform: isLogin
                  ? 'translateZ(0) scale(1) translateX(0)'
                  : 'translateZ(-200px) scale(0.8) translateX(-60%)',
                opacity: isLogin ? 1 : 0.5,
                filter: isLogin ? 'blur(0px)' : 'blur(5px)',
                zIndex: isLogin ? 20 : 10,
                pointerEvents: 'auto',
                cursor: isLogin ? 'default' : 'pointer',
                transformStyle: 'preserve-3d',
                transition:
                  'transform 0.8s cubic-bezier(0.68, -0.1, 0.265, 1.1), opacity 0.8s ease, filter 0.8s ease',
              }
        }
        className="absolute top-0 left-0 w-full max-w-md"
      >
        <LoginFormCard
          isActive={isLogin}
          onFlipToSignup={() => handleModeSwitch('signup')}
          onCardClick={() => !isLogin && handleModeSwitch('login')}
        />
      </div>

      {/* Signup / Register Card 3D Layer */}
      <div
        data-testid="auth-card-signup"
        onClick={() => isLogin && handleModeSwitch('signup')}
        style={
          prefersReducedMotion
            ? {
                opacity: !isLogin ? 1 : 0,
                pointerEvents: !isLogin ? 'auto' : 'none',
                zIndex: !isLogin ? 20 : 10,
                transform: 'none',
                filter: 'none',
                transition: 'opacity 0.25s ease-in-out',
              }
            : {
                transform: !isLogin
                  ? 'translateZ(0) scale(1) translateX(0)'
                  : 'translateZ(-200px) scale(0.8) translateX(60%)',
                opacity: !isLogin ? 1 : 0.5,
                filter: !isLogin ? 'blur(0px)' : 'blur(5px)',
                zIndex: !isLogin ? 20 : 10,
                pointerEvents: 'auto',
                cursor: !isLogin ? 'default' : 'pointer',
                transformStyle: 'preserve-3d',
                transition:
                  'transform 0.8s cubic-bezier(0.68, -0.1, 0.265, 1.1), opacity 0.8s ease, filter 0.8s ease',
              }
        }
        className="absolute top-0 left-0 w-full max-w-md"
      >
        <RegisterFormCard
          isActive={!isLogin}
          onFlipToLogin={() => handleModeSwitch('login')}
          onCardClick={() => isLogin && handleModeSwitch('signup')}
        />
      </div>
    </div>
  );
};
