import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function TokenRefreshOverlay() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      setIsRefreshing(customEvent.detail);
    };

    window.addEventListener('onTokenRefresh', handleTokenRefresh);

    return () => {
      window.removeEventListener('onTokenRefresh', handleTokenRefresh);
    };
  }, []);

  return (
    <AnimatePresence>
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Renovando sesión segura...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
