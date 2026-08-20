import { Link } from 'react-router-dom';
import type { DestinoResponseDTO } from '../types/destino';

interface DestinoCardProps {
  destino: DestinoResponseDTO;
  onDelete: (id: number) => void;
}

export const DestinoCard = ({ destino, onDelete }: DestinoCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-semibold text-slate-800">{destino.nombre}</h4>
        <button
          onClick={() => onDelete(destino.id)}
          className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg transition-colors duration-200 flex-shrink-0 ml-3"
        >
          Eliminar
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{destino.ciudad}, {destino.pais}</span>
      </div>

      {destino.notas && (
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{destino.notas}</p>
      )}

      <Link
        to={`/destinos/${destino.id}/actividades`}
        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200 text-sm"
      >
        Ver actividades
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};
