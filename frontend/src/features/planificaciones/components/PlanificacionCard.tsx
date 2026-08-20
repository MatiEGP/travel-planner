import { Link } from 'react-router-dom';
import type { PlanificacionResponseDTO } from '../types/planificacion';

interface PlanificacionCardProps {
  planificacion: PlanificacionResponseDTO;
  onDelete: (id: number) => void;
}

export const PlanificacionCard = ({ planificacion, onDelete }: PlanificacionCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-semibold text-slate-800">{planificacion.titulo}</h4>
        <button
          onClick={() => onDelete(planificacion.id)}
          className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg transition-colors duration-200 flex-shrink-0 ml-3"
        >
          Eliminar
        </button>
      </div>

      {planificacion.descripcion && (
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{planificacion.descripcion}</p>
      )}

      <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{formatDate(planificacion.fechaInicio)} — {formatDate(planificacion.fechaFin)}</span>
      </div>

      <Link
        to={`/planificaciones/${planificacion.id}/destinos`}
        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200 text-sm"
      >
        Ver destinos
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};
