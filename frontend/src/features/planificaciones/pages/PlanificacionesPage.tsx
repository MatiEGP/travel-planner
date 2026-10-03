import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/context/useAuth';
import { planificacionService } from '../api/planificacionService';
import { destinoService } from '../../destinos/api/destinoService';
import type { PlanificacionResponseDTO, PlanificacionRequestDTO } from '../types/planificacion';
import type { DestinoResponseDTO } from '../../destinos/types/destino';
import { Plus, AlertCircle } from 'lucide-react';
import { getTripStatus } from '../../../utils/tripUtils';

// New Refactored Components
import { PlanCard } from '../components/PlanCard';
import { PlanList } from '../components/PlanList';
import { PlanSkeleton } from '../components/PlanSkeleton';
import { EmptyPlanState } from '../components/EmptyPlanState';
import { PlanificacionFormModal } from '../components/PlanificacionFormModal';

type FilterTab = 'upcoming' | 'past';

export const PlanificacionesPage = () => {
  const { usuario } = useAuth();
  const [planificaciones, setPlanificaciones] = useState<PlanificacionResponseDTO[]>([]);
  const [destinosByPlan, setDestinosByPlan] = useState<Record<number, DestinoResponseDTO[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('upcoming');

  // Modal & Delete state
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
        setError(error.message || 'Error al cargar los viajes');
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

    // Sort upcoming trips by start date (closest first)
    upcoming.sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
    // Sort past trips by start date (most recent first)
    past.sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());

    return { upcomingTrips: upcoming, pastTrips: past };
  }, [planificaciones]);

  const displayedTrips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

  return (
    <div className="flex-1 text-slate-900 dark:text-slate-100 min-h-screen py-8 px-4 sm:px-8 lg:px-12 transition-colors duration-300 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              Mis Viajes
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Planificá tus itinerarios, actividades y descubrí nuevos lugares.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col-reverse sm:flex-row items-center gap-4"
          >
            {/* Pill Tabs */}
            <div
              className="relative inline-flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-full shadow-inner h-12 w-full sm:w-auto items-center backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
              role="tablist"
              aria-label="Filtro de viajes"
            >
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-700 rounded-full shadow-sm transition-transform duration-300 ease-out ${
                  activeTab === 'upcoming' ? 'translate-x-0' : 'translate-x-[100%]'
                }`}
              />
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'upcoming'}
                onClick={() => setActiveTab('upcoming')}
                className={`relative z-10 flex-1 sm:w-[150px] h-full rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'upcoming'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Próximos
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'upcoming' 
                    ? 'bg-slate-100 dark:bg-slate-600 text-slate-800 dark:text-slate-100' 
                    : 'bg-slate-300/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {upcomingTrips.length}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'past'}
                onClick={() => setActiveTab('past')}
                className={`relative z-10 flex-1 sm:w-[150px] h-full rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'past'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Pasados
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'past' 
                    ? 'bg-slate-100 dark:bg-slate-600 text-slate-800 dark:text-slate-100' 
                    : 'bg-slate-300/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {pastTrips.length}
                </span>
              </button>
            </div>

            {/* Primary Action Button (Desktop) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex bg-coral-500 hover:bg-coral-600 text-white font-bold h-12 px-6 rounded-full items-center justify-center gap-2 shadow-lg shadow-coral-500/30 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Viaje</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl text-rose-700 dark:text-rose-400 text-sm flex items-center gap-3 shadow-sm"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PlanList>
                {/* Show 4 skeletons while loading */}
                {[1, 2, 3, 4].map((n) => (
                  <PlanSkeleton key={n} />
                ))}
              </PlanList>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {displayedTrips.length > 0 ? (
                <PlanList>
                  {displayedTrips.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      planificacion={plan}
                      destinos={destinosByPlan[plan.id] || []}
                      onDelete={handleDelete}
                    />
                  ))}
                </PlanList>
              ) : (
                <div className="flex justify-center items-center min-h-[40vh]">
                  <EmptyPlanState 
                    type={activeTab} 
                    onCreateNew={() => setIsModalOpen(true)} 
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button (Mobile Only) */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="sm:hidden fixed bottom-24 right-6 z-40 bg-coral-500 text-white p-4 rounded-full shadow-xl shadow-coral-500/30 flex items-center justify-center"
          aria-label="Crear nuevo viaje"
        >
          <Plus className="w-6 h-6" />
        </motion.button>

        {/* Creation Form Modal */}
        <PlanificacionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreatePlan}
        />

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {tripToDelete !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                onClick={() => setTripToDelete(null)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl z-10"
              >
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-rose-500 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Eliminar viaje</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                  ¿Estás seguro de que querés borrar esta planificación? Esta acción no se puede deshacer y eliminará todos los itinerarios asociados.
                </p>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setTripToDelete(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={confirmDelete}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all"
                  >
                    Eliminar
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

