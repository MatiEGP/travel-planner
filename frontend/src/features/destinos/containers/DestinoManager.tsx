import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinoService } from '../api/destinoService';
import { planificacionService } from '../../planificaciones/api/planificacionService';
import type { DestinoResponseDTO } from '../types/destino';
import type { PlanificacionResponseDTO } from '../../planificaciones/types/planificacion';
import { DestinoForm } from '../components/DestinoForm';
import { DestinoCard } from '../components/DestinoCard';

interface DestinoManagerProps {
  planificacionId: number;
}

export const DestinoManager = ({ planificacionId }: DestinoManagerProps) => {
  const navigate = useNavigate();
  const [planificacion, setPlanificacion] = useState<PlanificacionResponseDTO | null>(null);
  const [destinos, setDestinos] = useState<DestinoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const [planData, destinosData] = await Promise.all([
          planificacionService.getById(planificacionId),
          destinoService.getByPlanificacion(planificacionId),
        ]);
        if (!cancelled) {
          setPlanificacion(planData);
          setDestinos(destinosData);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [planificacionId, refreshKey]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este destino? Se eliminarán también sus actividades.')) return;
    try {
      await destinoService.delete(id);
      refresh();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => navigate('/planificaciones')}
          className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200 text-sm mb-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a planificaciones
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          Destinos {planificacion ? `de "${planificacion.titulo}"` : ''}
        </h2>
        <p className="text-slate-500">Agregá los destinos que vas a visitar en este viaje.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <DestinoForm planificacionId={planificacionId} onCreated={refresh} />

        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Destinos agregados ({destinos.length})</h3>

          {loading && <p className="text-slate-500 text-center py-8">Cargando destinos...</p>}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>
          )}

          {!loading && !error && destinos.length === 0 && (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
              <p className="text-slate-500">No hay destinos aún. ¡Agregá el primer destino!</p>
            </div>
          )}

          {!loading && !error && destinos.length > 0 && (
            <div className="grid gap-4">
              {destinos.map((destino) => (
                <DestinoCard key={destino.id} destino={destino} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
