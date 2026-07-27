import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { actividadService } from '../services/actividadService';
import { destinoService } from '../services/destinoService';
import type { ActividadResponseDTO } from '../types/actividad';
import type { DestinoResponseDTO } from '../types/destino';
import { ActividadForm } from './ActividadForm';
import { ActividadCard } from './ActividadCard';

interface ActividadManagerProps {
  destinoId: number;
}

export const ActividadManager = ({ destinoId }: ActividadManagerProps) => {
  const navigate = useNavigate();
  const [destino, setDestino] = useState<DestinoResponseDTO | null>(null);
  const [actividades, setActividades] = useState<ActividadResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [destinoData, actividadesData] = await Promise.all([
        destinoService.getById(destinoId),
        actividadService.getByDestino(destinoId),
      ]);
      setDestino(destinoData);
      setActividades(actividadesData);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [destinoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;
    try {
      await actividadService.delete(id);
      fetchData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200 text-sm mb-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a destinos
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          Actividades {destino ? `en "${destino.nombre}"` : ''}
        </h2>
        {destino && (
          <p className="text-slate-500">{destino.ciudad}, {destino.pais}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <ActividadForm destinoId={destinoId} onCreated={fetchData} />

        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Itinerario ({actividades.length})</h3>

          {loading && <p className="text-slate-500 text-center py-8">Cargando actividades...</p>}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>
          )}

          {!loading && !error && actividades.length === 0 && (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
              <p className="text-slate-500">No hay actividades aún. ¡Agregá la primera actividad!</p>
            </div>
          )}

          {!loading && !error && actividades.length > 0 && (
            <div className="space-y-3">
              {actividades.map((act) => (
                <ActividadCard key={act.id} actividad={act} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
