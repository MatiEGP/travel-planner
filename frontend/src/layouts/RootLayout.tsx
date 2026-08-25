import { Outlet, useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const GlobalLoadingBar = () => {
  const navigation = useNavigation();
  // Se activa cuando React Router está cargando datos (loaders) o chunks de código
  const isLoading = navigation.state === 'loading';
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      // Arranca rápido al 10%
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => {
          // Se estanca en 85% hasta que termine de cargar
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          return prev + 15;
        });
      }, 300);
    } else {
      // Cuando termina, va al 100% y luego desaparece
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 400);
      return () => clearTimeout(timeout);
    }
    
    return () => clearInterval(interval);
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
  return (
    <>
      <GlobalLoadingBar />
      <Outlet />
    </>
  );
};
