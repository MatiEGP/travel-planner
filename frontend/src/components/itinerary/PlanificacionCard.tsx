import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlanificacionResponseDTO } from '../../types/planificacion';
import type { DestinoResponseDTO } from '../../types/destino';
import type { ActividadResponseDTO } from '../../types/actividad';

export type DestinoWithActividades = DestinoResponseDTO & {
  actividades?: ActividadResponseDTO[];
};

interface Props {
  planificacion: PlanificacionResponseDTO;
  destinos?: DestinoWithActividades[];
  onDelete?: (id: number) => void;
}

export const PlanificacionCard: React.FC<Props> = ({ planificacion, destinos = [], onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/planificaciones/${planificacion.id}/destinos`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(planificacion.id);
    }
  };

  // Calculate duration in days safely
  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Inclusive of start and end day
  };

  const durationDays = calculateDays(planificacion.fechaInicio, planificacion.fechaFin);

  return (
    <div 
      className="group flex flex-col bg-slate-800/50 backdrop-blur-md border border-slate-600 rounded-2xl p-6 cursor-pointer hover:border-teal-400 hover:bg-slate-800/70 transition-all shadow-lg hover:shadow-teal-900/20 relative overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />

      <div className="mb-4 pb-4 border-b border-slate-700/50 flex justify-between items-start relative z-10">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-extrabold text-white leading-tight">{planificacion.titulo}</h3>
            {durationDays && (
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-teal-500/30 whitespace-nowrap">
                {durationDays} {durationDays === 1 ? 'Día' : 'Días'}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 line-clamp-2">{planificacion.descripcion}</p>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {planificacion.fechaInicio} &mdash; {planificacion.fechaFin}
          </div>
        </div>
        
        {onDelete && (
          <button 
            onClick={handleDeleteClick}
            className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-colors shrink-0"
            title="Borrar Plan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-end relative z-10">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Destinos</h4>
        {destinos.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {destinos.map((destino) => (
              <span 
                key={destino.id} 
                className="bg-slate-900/50 text-slate-200 text-xs px-3 py-1.5 rounded-full border border-slate-700 shadow-sm flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {destino.ciudad}, {destino.pais}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic bg-slate-900/20 rounded-lg py-2 px-3 border border-slate-700/30 inline-block self-start">
            Aún no agregaste destinos a este viaje.
          </p>
        )}
      </div>
    </div>
  );
};
