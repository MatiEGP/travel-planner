import { motion } from 'framer-motion';
import { Compass, Plus } from 'lucide-react';

interface EmptyPlanStateProps {
  type: 'upcoming' | 'past';
  onCreateNew?: () => void;
}

export const EmptyPlanState = ({ type, onCreateNew }: EmptyPlanStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 backdrop-blur-sm"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6 shadow-inner"
      >
        <Compass className="w-16 h-16 text-slate-400 dark:text-slate-500" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
        {type === 'upcoming' ? 'No tenés viajes próximos' : 'No hay historial de viajes'}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        {type === 'upcoming'
          ? 'El mundo te espera. Empezá a planificar tu próxima aventura y mantén todo organizado en un solo lugar.'
          : 'Cuando completes tus viajes, aparecerán acá para que puedas revivir tus recuerdos.'}
      </p>

      {type === 'upcoming' && onCreateNew && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-coral-500 hover:bg-coral-600 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-coral-500/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Crear tu primera planificación</span>
        </motion.button>
      )}
    </motion.div>
  );
};

