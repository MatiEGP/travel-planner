import React from 'react';
import type { ActividadResponseDTO } from '../../features/actividades/types/actividad';

interface Props {
  actividad: ActividadResponseDTO;
}

export const ActivityListItem: React.FC<Props> = ({ actividad }) => {
  // Format date/time if needed, keeping it simple
  const timeString = new Date(actividad.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <li className="flex flex-col py-2 border-b border-stone-200 last:border-b-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-800">{actividad.nombre}</span>
        <span className="text-xs text-stone-500">{timeString}</span>
      </div>
      {actividad.notas && (
        <p className="text-xs text-stone-600 mt-1">{actividad.notas}</p>
      )}
    </li>
  );
};
