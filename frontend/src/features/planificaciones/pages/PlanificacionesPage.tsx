import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/context/useAuth';
import { planificacionService } from '../api/planificacionService';
import { destinoService } from '../../destinos/api/destinoService';
import type { PlanificacionResponseDTO, PlanificacionRequestDTO } from '../types/planificacion';
import type { DestinoResponseDTO } from '../../destinos/types/destino';
import { Plus, AlertCircle, Compass } from 'lucide-react';
import { PlanificacionCard } from '../../../components/itinerary/PlanificacionCard';
import { QuickCreateCard } from '../../../components/itinerary/QuickCreateCard';
import { PlanificacionFormModal } from '../../../components/itinerary/PlanificacionFormModal';
import { getTripStatus } from '../../../utils/tripUtils';

type FilterTab = 'upcoming' | 'past';

export const PlanificacionesPage = () => {
  const { usuario } = useAuth();
  const [planificaciones, setPlanificaciones] = useState<PlanificacionResponseDTO[]>([]);
  const [destinosByPlan, setDestinosByPlan] = useState<Record<number, DestinoResponseDTO[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('upcoming');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await planificacionService.getByUsuario(usuario.id);

        if (!cancelled) {
          setPlanificaciones(data);
          setError(null);

          // Fetch destinations in parallel
          const destPromises = data.map((plan) =>
            destinoService
              .getByPlanificacion(plan.id)
              .then((destinos) => ({ planId: plan.id, destinos }))
              .catch(() => ({ planId: plan.id, destinos: [] }))
          );

          const destResults = await Promise.all(destPromises);
          const destMap: Record<number, DestinoResponseDTO[]> = {};
          destResults.forEach((res) => {
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

    loadData();
    return () => {
      cancelled = true;
    };
  }, [usuario]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que querés borrar esta planificación?')) return;
    try {
      await planificacionService.delete(id);
      setPlanificaciones((prev) => prev.filter((p) => p.id !== id));
      setDestinosByPlan((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      alert('Error al borrar la planificación: ' + (err as Error).message);
    }
  };

  const handleCreatePlan = async (data: PlanificacionRequestDTO) => {
    const newPlan = await planificacionService.create(data);
    setPlanificaciones((prev) => [...prev, newPlan]);
  };

  // Filter trips based on activeTab
  const { upcomingTrips, pastTrips } = useMemo(() => {
    const upcoming: PlanificacionResponseDTO[] = [];
    const past: PlanificacionResponseDTO[] = [];

    planificaciones.forEach((trip) => {
      const status = getTripStatus(trip.fechaInicio, trip.fechaFin);
      if (status === 'COMPLETED') {
        past.push(trip);
      } else {
        upcoming.push(trip);
      }
    });

    return { upcomingTrips: upcoming, pastTrips: past };
  }, [planificaciones]);

  const displayedTrips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-slate-900 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mis Viajes
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Planificá tus itinerarios, actividades y descubrí nuevos lugares.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Pill Tabs */}
            <div
              className="inline-flex p-1 bg-slate-200/80 rounded-full shadow-inner"
              role="tablist"
              aria-label="Filtro de viajes"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'upcoming'}
                onClick={() => setActiveTab('upcoming')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Próximos Viajes
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {upcomingTrips.length}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'past'}
                onClick={() => setActiveTab('past')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'past'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Viajes Pasados
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {pastTrips.length}
                </span>
              </button>
            </div>

            {/* Primary Coral CTA */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF5A5F] hover:bg-[#E0484D] text-white font-bold py-2.5 px-6 rounded-full flex items-center gap-2 shadow-md hover:shadow-rose-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Planificación</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="p-4 mb-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-3 shadow-sm"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-[#FF5A5F] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Cargando tus viajes...</p>
          </div>
        )}

        {/* Trips Grid */}
        {!loading && (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {/* First item is ALWAYS QuickCreateCard */}
            <QuickCreateCard onClick={() => setIsModalOpen(true)} />

            {/* Render travel cards */}
            {displayedTrips.map((plan) => (
              <PlanificacionCard
                key={plan.id}
                planificacion={plan}
                destinos={destinosByPlan[plan.id] || []}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Empty state notice if no trips match current tab */}
        {!loading && displayedTrips.length === 0 && (
          <div className="mt-8 text-center py-8 px-4">
            <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium text-sm">
              {activeTab === 'upcoming'
                ? 'No tenés viajes próximos planificados. Hacé clic en la tarjeta para crear uno.'
                : 'No tenés viajes finalizados en tu historial.'}
            </p>
          </div>
        )}

        {/* Creation Form Modal */}
        <PlanificacionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreatePlan}
        />
      </div>
    </div>
  );
};
