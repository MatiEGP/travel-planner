import { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/context/useAuth';
import { PageTransitionOverlay } from './PageTransitionOverlay';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isLoading, isHydrating } = useAuth();
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);

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

  const showOverlay = isLoading || isRefreshingToken;
  
  let message = "Cargando...";
  if (isHydrating || (isLoading && !isRefreshingToken)) {
    message = "Cargando sesión...";
  } else if (isRefreshingToken) {
    message = "Renovando sesión segura...";
  }

  return (
    <>
      {children}
      <PageTransitionOverlay visible={showOverlay} message={message} />
    </>
  );
}
