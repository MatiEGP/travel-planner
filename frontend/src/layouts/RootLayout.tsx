import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '../shared/components/layout/Header';

const GlobalLoadingBar = () => {
  let isLoading = false;
  try {
    const navigation = useNavigation();
    isLoading = navigation?.state === 'loading';
  } catch {
    isLoading = false;
  }
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;
    
    if (isLoading) {
      timeout = setTimeout(() => {
        setProgress(10);
        interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 85) {
              clearInterval(interval);
              return 85;
            }
            return prev + 15;
          });
        }, 300);
      }, 0);
    } else {
      timeout = setTimeout(() => {
        setProgress(100);
        setTimeout(() => setProgress(0), 400);
      }, 0);
    }
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full bg-transparent pointer-events-none">
      <div
        className="h-full bg-teal-400 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px #2dd4bf, 0 0 5px #2dd4bf'
        }}
      />
    </div>
  );
};

export const RootLayout = () => {
  const location = useLocation();
  const isAuthRoute = ['/login', '/register', '/registro'].includes(location.pathname);

  return (
    <div
      data-testid="root-layout"
      className={`min-h-screen flex flex-col ${isAuthRoute ? 'bg-[#F7F9FA]' : 'bg-slate-900'}`}
    >
      <GlobalLoadingBar />
      {!isAuthRoute && <Header />}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

