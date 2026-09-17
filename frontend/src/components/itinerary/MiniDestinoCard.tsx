import React from 'react';
import type { DestinoResponseDTO } from '../../features/destinos/types/destino';
import type { ActividadResponseDTO } from '../../features/actividades/types/actividad';
import { ActivityListItem } from './ActivityListItem';

interface Props {
  destino: DestinoResponseDTO;
  actividades?: ActividadResponseDTO[];
}

export const MiniDestinoCard: React.FC<Props> = ({ destino, actividades = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-100 p-4 mb-4">
      <div className="mb-2">
        <h4 className="text-md font-bold text-stone-800">{destino.nombre}</h4>
        <p className="text-xs text-stone-500">
          {destino.ciudad}, {destino.pais}
        </p>
      </div>
      
      {actividades.length > 0 ? (
        <ul className="mt-3">
          {actividades.map((act) => (
            <ActivityListItem key={act.id} actividad={act} />
          ))}
        </ul>
      ) : (
        <p className="text-xs text-stone-400 mt-2 italic">No activities planned yet.</p>
      )}
    </div>
  );
};
