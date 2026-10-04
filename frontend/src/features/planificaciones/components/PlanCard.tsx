import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Trash2 } from 'lucide-react';
import type { PlanificacionResponseDTO } from '../types/planificacion';
import type { DestinoResponseDTO } from '../../destinos/types/destino';

interface PlanCardProps {
  planificacion: PlanificacionResponseDTO;
  destinos: DestinoResponseDTO[];
  onDelete: (id: number) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring' as const, 
      stiffness: 200, 
      damping: 25 
    } 
  },
};

export const PlanCard = ({ planificacion, destinos, onDelete }: PlanCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      <Link 
        to={`/planificaciones/${planificacion.id}`} 
        className="flex-1 flex flex-col p-6 sm:p-8 relative z-10"
      >
        <div className="flex items-start justify-between gap-4 mb-4 pr-12">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
            {planificacion.titulo}
          </h3>
        </div>

        {planificacion.descripcion && (
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">
            {planificacion.descripcion}
          </p>
        )}

        <div className="space-y-3 mt-auto">
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-700/30 py-2.5 px-4 rounded-xl w-fit">
            <Calendar className="w-4 h-4 text-coral-500 dark:text-coral-400" />
            <span>{formatDate(planificacion.fechaInicio)} — {formatDate(planificacion.fechaFin)}</span>
          </div>

          {destinos && destinos.length > 0 && (
            <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/30 py-2.5 px-4 rounded-xl">
              <MapPin className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-1 leading-relaxed">
                {destinos.map((destino, index) => (
                  <span key={destino.id}>
                    {destino.ciudad}
                    {index < destinos.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Animated Tag sliding up from bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-2 opacity-0 group-hover:translate-y-1/2 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-0">
        <div className="bg-coral-500 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          Click para ver detalles
        </div>
      </div>

      {/* Delete button positioned absolutely to avoid being inside the Link */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(planificacion.id);
        }}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-700/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2.5 rounded-full transition-colors z-20 cursor-pointer shadow-sm hover:shadow-md"
        aria-label="Eliminar viaje"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

