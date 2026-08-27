import React from 'react';
import type { ItemItinerarioDTO} from '../types/itinerario';

interface Props {
  item: ItemItinerarioDTO;
}

export const ItemItinerarioRow: React.FC<Props> = ({ item }) => {
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    // Assume timeStr might be HH:mm:ss or similar, let's just display it.
    return timeStr.slice(0, 5); 
  };

  const totalCost = item.costos.reduce((acc, costo) => acc + costo.monto, 0);

  return (
    <div className="flex flex-col sm:flex-row bg-slate-800 rounded-lg p-4 mb-3 border border-slate-700 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-1 bg-teal-900 text-teal-300 rounded uppercase">
            {item.tipo}
          </span>
          <h4 className="text-lg font-semibold text-white">{item.titulo}</h4>
        </div>
        
        {item.descripcion && (
          <p className="text-slate-400 text-sm mb-2">{item.descripcion}</p>
        )}
        
        {(item.horaInicio || item.horaFin) && (
          <div className="text-sm text-slate-300 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {formatTime(item.horaInicio)} {item.horaFin ? `- ${formatTime(item.horaFin)}` : ''}
          </div>
        )}
      </div>

      {item.costos.length > 0 && (
        <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col justify-center items-end border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-4 min-w-[120px]">
          <span className="text-xs text-slate-400 mb-1">Costos</span>
          <span className="text-lg font-bold text-teal-400">
            ${totalCost.toFixed(2)}
          </span>
          <div className="flex gap-1 mt-1 flex-wrap justify-end">
            {item.costos.map((c, idx) => (
              <span key={c.id || idx} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded" title={c.categoria}>
                {c.moneda} {c.monto}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
