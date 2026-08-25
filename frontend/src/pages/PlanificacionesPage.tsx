import { useState, useEffect } from 'react';
import { planificacionService } from '../services/planificacionService';
import type { PlanificacionResponseDTO } from '../types/planificacion';
import { useAuth } from '../context/useAuth';
import PlannerLayout from '../layouts/PlannerLayout';
import { PlanificacionCard } from '../components/itinerary/PlanificacionCard';

export const PlanificacionesPage = () => {
  const { usuario } = useAuth();
  const [planificaciones, setPlanificaciones] = useState<PlanificacionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await planificacionService.getByUsuario(usuario.id);
        if (!cancelled) {
          setPlanificaciones(data);
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
  }, [usuario]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que querés borrar esta planificación?')) return;
    try {
      await planificacionService.delete(id);
      setPlanificaciones(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Error al borrar la planificación: ' + (err as Error).message);
    }
  };

  return (
    <PlannerLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-1">Mis Planificaciones</h2>
        <p className="text-stone-500">Creá y gestioná tus viajes.</p>
      </div>

      {loading && <p className="text-stone-500 text-center py-8">Cargando planificaciones...</p>}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm mb-6">
          {error}
        </div>
      )}

      {!loading && !error && planificaciones.length === 0 && (
        <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-white shadow-sm">
          <p className="text-stone-500">No tenés planificaciones aún. ¡Creá tu primer viaje!</p>
        </div>
      )}

      {!loading && !error && planificaciones.length > 0 && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {planificaciones.map((plan) => (
            <PlanificacionCard
              key={plan.id}
              planificacion={plan}
              destinos={[]} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </PlannerLayout>
  );
};
