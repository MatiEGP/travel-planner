import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/useAuth';
import { PageTransitionOverlay } from './PageTransitionOverlay';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isLoading, isHydrating } = useAuth();
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.pathname === '/') {
      setIsNavigating(false);
      return;
    }
    setIsNavigating(true);
    const timeoutId = setTimeout(() => {
      setIsNavigating(false);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      setIsRefreshingToken(customEvent.detail);
    };

    window.addEventListener('onTokenRefresh', handleTokenRefresh);

    return () => {
      window.removeEventListener('onTokenRefresh', handleTokenRefresh);
    };
  }, []);

  const showOverlay = isLoading || isRefreshingToken || isNavigating;
  
  let message = "Cargando...";
  if (isRefreshingToken) {
    message = "Renovando sesión segura...";
  } else if (isHydrating || (isLoading && !isNavigating)) {
    message = "Cargando sesión...";
  }

  return (
    <>
      {children}
      <PageTransitionOverlay visible={showOverlay} message={message} />
    </>
  );
}
