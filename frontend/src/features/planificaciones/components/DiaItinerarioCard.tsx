import React from 'react';
import { DiaItinerarioDTO } from '../types/itinerario';
import { ItemItinerarioRow } from './ItemItinerarioRow';

interface Props {
  dia: DiaItinerarioDTO;
}

export const DiaItinerarioCard: React.FC<Props> = ({ dia }) => {
  const formattedDate = new Date(dia.fecha).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-5 mb-6 border border-slate-700/50 shadow-md">
      <div className="border-b border-slate-700 pb-3 mb-4 flex items-center gap-3">
        <div className="bg-teal-500/20 p-2 rounded-lg text-teal-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white capitalize">{formattedDate}</h3>
      </div>
      
      {dia.items.length === 0 ? (
        <p className="text-slate-400 italic py-4 text-center">No items planned for this day yet.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {dia.items.map(item => (
            <ItemItinerarioRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
