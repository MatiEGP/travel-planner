import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import type { MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/useAuth';

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const backgroundRadial = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(34, 197, 94, 0.1), transparent 80%)`;
  const titleWords = "Organiza tu próximo viaje con Fuimonos".split(" ");

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      onMouseMove={handleMouseMove}
    >
      {/* Fondo dinámico reacciona al mouse */}
      <motion.div
        className="absolute inset-0 z-0 hidden sm:block pointer-events-none"
        style={{ background: backgroundRadial }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {titleWords.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 150 }}
            >
              {word === 'Fuimonos' ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 to-ocean-500">
                  {word}
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto"
        >
          Armá itinerarios, sumá destinos y gestioná tus actividades. La plataforma definitiva para que tu próxima aventura empiece a planearse sola.
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 1 }}
        >
          {isAuthenticated ? (
            <Link
              to="/planificaciones"
              className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">Mis Planificaciones</span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-slate-900/10 to-transparent z-0" />
            </Link>
          ) : (
            <Link
              to="/register"
              state={{ from: location }}
              className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">Comenzar Aventura</span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-slate-900/10 to-transparent z-0" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
