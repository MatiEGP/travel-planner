import { useState, useEffect } from 'react';
import { planificacionService } from '../services/planificacionService';
import { destinoService } from '../services/destinoService';
import type { PlanificacionResponseDTO, PlanificacionRequestDTO } from '../types/planificacion';
import type { DestinoResponseDTO } from '../types/destino';
import { useAuth } from '../context/useAuth';
import PlannerLayout from '../layouts/PlannerLayout';
import { PlanificacionCard } from '../components/itinerary/PlanificacionCard';
import { PlanificacionFormModal } from '../components/itinerary/PlanificacionFormModal';

export const PlanificacionesPage = () => {
  const { usuario } = useAuth();
  const [planificaciones, setPlanificaciones] = useState<PlanificacionResponseDTO[]>([]);
  const [destinosByPlan, setDestinosByPlan] = useState<Record<number, DestinoResponseDTO[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          
          // Fetch destinations in parallel to populate the cards
          const destPromises = data.map(plan => 
            destinoService.getByPlanificacion(plan.id)
              .then(destinos => ({ planId: plan.id, destinos }))
              .catch(() => ({ planId: plan.id, destinos: [] })) // Fallback on error
          );
          
          const destResults = await Promise.all(destPromises);
          const destMap: Record<number, DestinoResponseDTO[]> = {};
          destResults.forEach(res => {
            destMap[res.planId] = res.destinos;
          });
          
          if (!cancelled) {
            setDestinosByPlan(destMap);
          }
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
      
      // Cleanup map
      setDestinosByPlan(prev => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    } catch (err) {
      alert('Error al borrar la planificación: ' + (err as Error).message);
    }
  };

  const handleCreatePlan = async (data: PlanificacionRequestDTO) => {
    const newPlan = await planificacionService.create(data);
    setPlanificaciones(prev => [...prev, newPlan]);
  };

  return (
    <PlannerLayout onNewTrip={() => setIsModalOpen(true)}>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Mis Planificaciones</h2>
        <p className="text-slate-300 font-medium text-lg">Creá y gestioná tus próximos viajes.</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-medium">Cargando tus viajes...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-200 text-sm mb-6 flex items-start gap-3 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {!loading && !error && planificaciones.length === 0 && (
        <div className="border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center bg-slate-800/30 backdrop-blur-sm shadow-inner">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Aún no tenés viajes</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Parece que tu pasaporte está juntando polvo. ¡Empezá a planificar tu próxima aventura ahora mismo!</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-teal-500/25 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Crear primer viaje
          </button>
        </div>
      )}

      {!loading && !error && planificaciones.length > 0 && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {planificaciones.map((plan) => (
            <PlanificacionCard
              key={plan.id}
              planificacion={plan}
              destinos={destinosByPlan[plan.id] || []} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <PlanificacionFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePlan} 
      />
    </PlannerLayout>
  );
};
