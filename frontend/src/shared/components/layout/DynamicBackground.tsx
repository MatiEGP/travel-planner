import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export const DynamicBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for subtle movement
  const springConfig = { damping: 50, stiffness: 100, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize between -1 and 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Translate by a small amount
  const translateX1 = useTransform(smoothX, [-1, 1], [-30, 30]);
  const translateY1 = useTransform(smoothY, [-1, 1], [-30, 30]);

  const translateX2 = useTransform(smoothX, [-1, 1], [30, -30]);
  const translateY2 = useTransform(smoothY, [-1, 1], [30, -30]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
      {/* Subtle colorful blobs */}
      <motion.div
        className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        style={{ 
          background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)',
          x: translateX1, 
          y: translateY1 
        }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        style={{ 
          background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)',
          x: translateX2, 
          y: translateY2 
        }}
      />
    </div>
  );
};

