import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/context/useAuth';
import { planificacionService } from '../api/planificacionService';
import { destinoService } from '../../destinos/api/destinoService';
import type { PlanificacionResponseDTO, PlanificacionRequestDTO } from '../types/planificacion';
import type { DestinoResponseDTO } from '../../destinos/types/destino';
import { Plus, AlertCircle, Compass } from 'lucide-react';
import { PlanificacionCard } from '../../../components/itinerary/PlanificacionCard';
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
  const [tripToDelete, setTripToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await planificacionService.getByUsuario(usuario.id, { signal: controller.signal });

        setPlanificaciones(data);
        setError(null);

        // Fetch destinations in parallel
        const destPromises = data.map((plan) =>
          destinoService
            .getByPlanificacion(plan.id, { signal: controller.signal })
            .then((destinos) => ({ planId: plan.id, destinos }))
            .catch((err) => {
              if (err.name === 'AbortError' || err.name === 'CanceledError') {
                throw err;
              }
              return { planId: plan.id, destinos: [] };
            })
        );

        const destResults = await Promise.all(destPromises);
        const destMap: Record<number, DestinoResponseDTO[]> = {};
        destResults.forEach((res) => {
          destMap[res.planId] = res.destinos;
        });

        setDestinosByPlan(destMap);
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

    loadData();
    return () => {
      controller.abort();
    };
  }, [usuario]);

  const handleDelete = (id: number) => {
    setTripToDelete(id);
  };

  const confirmDelete = async () => {
    if (tripToDelete === null) return;
    try {
      await planificacionService.delete(tripToDelete);
      setPlanificaciones((prev) => prev.filter((p) => p.id !== tripToDelete));
      setDestinosByPlan((prev) => {
        const next = { ...prev };
        delete next[tripToDelete];
        return next;
      });
      setTripToDelete(null);
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
    <div className="flex-1 bg-[#F7F9FA] text-slate-900 py-8 px-4 sm:px-8 lg:px-12">
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
              className="relative inline-flex p-1 bg-slate-200/80 rounded-full shadow-inner h-12 items-center"
              role="tablist"
              aria-label="Filtro de viajes"
            >
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-out ${
                  activeTab === 'upcoming' ? 'translate-x-0' : 'translate-x-[100%]'
                }`}
              />
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'upcoming'}
                onClick={() => setActiveTab('upcoming')}
                className={`relative z-10 w-[140px] h-full rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                  activeTab === 'upcoming'
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Próximos Viajes
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full flex items-center justify-center ${activeTab === 'upcoming' ? 'bg-slate-100 text-slate-600' : 'bg-slate-300/50 text-slate-500'}`}>
                  {upcomingTrips.length}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'past'}
                onClick={() => setActiveTab('past')}
                className={`relative z-10 w-[140px] h-full rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                  activeTab === 'past'
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Viajes Pasados
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full flex items-center justify-center ${activeTab === 'past' ? 'bg-slate-100 text-slate-600' : 'bg-slate-300/50 text-slate-500'}`}>
                  {pastTrips.length}
                </span>
              </button>
            </div>

            {/* Primary Coral CTA */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group border-2 border-dashed border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white font-bold h-12 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm hover:shadow-rose-500/25 transition-all duration-300 cursor-pointer active:scale-95"
            >
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
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
            <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Cargando tus viajes...</p>
          </div>
        )}

        {/* Trips Grid */}
        {!loading && (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-stretch">
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

        {/* Delete Confirmation Modal */}
        {tripToDelete !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setTripToDelete(null)} />
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 z-10">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Eliminar viaje</h3>
              <p className="text-slate-500 mb-6 text-sm">
                ¿Estás seguro de que querés borrar esta planificación? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTripToDelete(null)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-coral-500 hover:bg-coral-600 shadow-sm transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
