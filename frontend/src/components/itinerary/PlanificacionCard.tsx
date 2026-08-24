import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlanificacionResponseDTO } from '../../types/planificacion';
import type { DestinoResponseDTO } from '../../types/destino';
import type { ActividadResponseDTO } from '../../types/actividad';
import { MiniDestinoCard } from './MiniDestinoCard';

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

  return (
    <div 
      className="bg-stone-50 rounded-xl shadow-md p-6 mb-6 cursor-pointer hover:shadow-lg transition-shadow relative"
      onClick={handleCardClick}
    >
      <div className="mb-4 pb-4 border-b border-stone-200 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-extrabold text-stone-900">{planificacion.titulo}</h3>
          <p className="text-sm text-stone-600 mt-1">{planificacion.descripcion}</p>
          <div className="text-xs text-stone-500 mt-2 font-medium">
            {planificacion.fechaInicio} — {planificacion.fechaFin}
          </div>
        </div>
        {onDelete && (
          <button 
            onClick={handleDeleteClick}
            className="text-rose-500 hover:text-rose-700 p-2 rounded hover:bg-rose-50 transition-colors"
            title="Delete Plan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="destinos-list">
        {destinos.length > 0 ? (
          destinos.map((destino) => (
            <MiniDestinoCard 
              key={destino.id} 
              destino={destino} 
              actividades={destino.actividades} 
            />
          ))
        ) : (
          <p className="text-sm text-stone-400 italic">No destinations added to this trip yet.</p>
        )}
      </div>
    </div>
  );
};
