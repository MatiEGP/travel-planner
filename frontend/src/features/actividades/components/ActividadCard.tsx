import type { ActividadResponseDTO } from '../types/actividad';

interface ActividadCardProps {
  actividad: ActividadResponseDTO;
  onDelete: (id: number) => void;
}

export const ActividadCard = ({ actividad, onDelete }: ActividadCardProps) => {
  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{actividad.nombre}</h4>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mt-1">
              {formatDateTime(actividad.fechaHora)}
            </span>
            {actividad.notas && (
              <p className="text-slate-500 text-sm mt-2">{actividad.notas}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(actividad.id)}
          className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg transition-colors duration-200 flex-shrink-0 ml-3"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
