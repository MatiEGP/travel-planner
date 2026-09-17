import { useState, useEffect, useCallback } from 'react';
import { planificacionService } from '../api/planificacionService';
import type { PlanificacionResponseDTO } from '../types/planificacion';
import { PlanificacionForm } from '../components/PlanificacionForm';
import { PlanificacionCard } from '../components/PlanificacionCard';
import { useAuth } from '../../auth/context/useAuth';

export const PlanificacionManager = () => {
  const { usuario } = useAuth();
  const [planificaciones, setPlanificaciones] = useState<PlanificacionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!usuario) return;
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        const data = await planificacionService.getByUsuario(usuario.id, { signal: controller.signal });
        setPlanificaciones(data);
        setError(null);
      } catch (err) {
        const error = err as Error;
        if (error.name === 'AbortError' || error.name === 'CanceledError') return;
        setError(error.message || 'Error loading data');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => { controller.abort(); };
  }, [usuario, refreshKey]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta planificación? Se eliminarán también sus destinos y actividades.')) return;
    try {
      await planificacionService.delete(id);
      refresh();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Mis Planificaciones</h2>
        <p className="text-slate-500">Creá y gestioná tus viajes.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <PlanificacionForm onCreated={refresh} />

        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Viajes planificados ({planificaciones.length})
          </h3>

          {loading && <p className="text-slate-500 text-center py-8">Cargando planificaciones...</p>}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && planificaciones.length === 0 && (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
              <p className="text-slate-500">No tenés planificaciones aún. ¡Creá tu primer viaje!</p>
            </div>
          )}

          {!loading && !error && planificaciones.length > 0 && (
            <div className="grid gap-4">
              {planificaciones.map((plan) => (
                <PlanificacionCard
                  key={plan.id}
                  planificacion={plan}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
