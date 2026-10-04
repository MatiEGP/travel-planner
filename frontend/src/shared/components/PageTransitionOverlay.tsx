import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionOverlayProps {
  visible: boolean;
  message?: string;
}

export function PageTransitionOverlay({ visible, message = "Cargando..." }: PageTransitionOverlayProps) {
  const [isShowing, setIsShowing] = useState(false);
  const showStartTime = useRef<number>(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }

      if (!isShowing) {
        setIsShowing(true);
        showStartTime.current = Date.now();
      }

      // Maximum 8s safety net
      maxTimeoutRef.current = setTimeout(() => {
        setIsShowing(false);
      }, 8000);
    } else {
      if (isShowing) {
        const timeElapsed = Date.now() - showStartTime.current;
        const timeRemaining = Math.max(0, 400 - timeElapsed);

        hideTimeoutRef.current = setTimeout(() => {
          setIsShowing(false);
        }, timeRemaining);
      }
    }

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    };
  }, [visible, isShowing]);

  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 dark:bg-slate-900"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-500">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
