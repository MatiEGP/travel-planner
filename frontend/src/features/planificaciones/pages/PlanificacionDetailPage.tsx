import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

import type { PlanificacionResponseDTO } from '../types/planificacion';
import type { DestinoResponseDTO, DestinoRequestDTO } from '../../destinos/types/destino';
import type { ActividadResponseDTO, ActividadRequestDTO } from '../../actividades/types/actividad';
import type { CostoResponseDTO, CostoRequestDTO } from '../types/costo';
import type {
  DiaItinerarioResponseDTO,
  DiaItinerarioRequestDTO,
  ItemItinerarioRequestDTO,
} from '../types/itinerario';

import { planificacionService } from '../api/planificacionService';
import { destinoService } from '../../destinos/api/destinoService';
import { actividadService } from '../../actividades/api/actividadService';
import { costoService } from '../api/costoService';
import { itinerarioService } from '../api/itinerarioService';

import { TripDetailHeader } from '../components/detail/TripDetailHeader';
import { DetailDestinationsCard } from '../components/detail/DetailDestinationsCard';
import { DetailActivitiesCard } from '../components/detail/DetailActivitiesCard';
import { DetailExpensesCard } from '../components/detail/DetailExpensesCard';
import { DetailItineraryCard } from '../components/detail/DetailItineraryCard';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8 animate-pulse overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-slate-800/20 dark:to-transparent pointer-events-none" />
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-48" />
    </div>
    <div className="space-y-4">
      <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full" />
      <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full md:w-3/4" />
    </div>
  </div>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
};

export const PlanificacionDetailPage: React.FC = () => {
  const { planificacionId } = useParams<{ planificacionId: string }>();
  const navigate = useNavigate();

  const id = planificacionId ? parseInt(planificacionId, 10) : NaN;

  const [planificacion, setPlanificacion] = useState<PlanificacionResponseDTO | null>(null);
  const [destinos, setDestinos] = useState<DestinoResponseDTO[]>([]);
  const [actividades, setActividades] = useState<ActividadResponseDTO[]>([]);
  const [costos, setCostos] = useState<CostoResponseDTO[]>([]);
  const [dias, setDias] = useState<DiaItinerarioResponseDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    if (isNaN(id)) {
      setError('ID de planificación inválido.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [planRes, destRes, actRes, costRes, diasRes] = await Promise.all([
        planificacionService.getById(id),
        destinoService.getByPlanificacion(id),
        actividadService.getByPlanificacion(id),
        costoService.getByPlanificacion(id),
        itinerarioService.getDiasByPlanificacion(id),
      ]);

      setPlanificacion(planRes);
      setDestinos(destRes || []);
      setActividades(actRes || []);
      setCostos(costRes || []);
      setDias(diasRes || []);
    } catch (err) {
      setError((err as Error).message || 'Error al cargar los detalles del viaje.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isNaN(id)) return;

    const controller = new AbortController();
    setLoading(true);

    Promise.all([
      planificacionService.getById(id, { signal: controller.signal }),
      destinoService.getByPlanificacion(id, { signal: controller.signal }),
      actividadService.getByPlanificacion(id, { signal: controller.signal }),
      costoService.getByPlanificacion(id, { signal: controller.signal }),
      itinerarioService.getDiasByPlanificacion(id, { signal: controller.signal }),
    ])
      .then(([planRes, destRes, actRes, costRes, diasRes]) => {
        setPlanificacion(planRes);
        setDestinos(destRes || []);
        setActividades(actRes || []);
        setCostos(costRes || []);
        setDias(diasRes || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        const error = err as Error;
        if (error.name === 'AbortError' || error.name === 'CanceledError') return;
        setError(error.message || 'Error al cargar los detalles del viaje.');
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [id]);

  // Destination handlers
  const handleAddDestino = async (data: DestinoRequestDTO) => {
    await destinoService.create(data);
    const updated = await destinoService.getByPlanificacion(id);
    setDestinos(updated);
  };
  const handleDeleteDestino = async (destinoId: number) => {
    await destinoService.delete(destinoId);
    const [updatedDest, updatedAct] = await Promise.all([
      destinoService.getByPlanificacion(id),
      actividadService.getByPlanificacion(id),
    ]);
    setDestinos(updatedDest);
    setActividades(updatedAct);
  };

  // Activity handlers
  const handleAddActividad = async (data: ActividadRequestDTO) => {
    await actividadService.create(data);
    const updated = await actividadService.getByPlanificacion(id);
    setActividades(updated);
  };
  const handleDeleteActividad = async (actividadId: number) => {
    await actividadService.delete(actividadId);
    const updated = await actividadService.getByPlanificacion(id);
    setActividades(updated);
  };

  // Cost handlers
  const handleAddCosto = async (data: CostoRequestDTO) => {
    await costoService.create(data);
    const updated = await costoService.getByPlanificacion(id);
    setCostos(updated);
  };
  const handleDeleteCosto = async (costoId: number) => {
    await costoService.delete(costoId);
    const updated = await costoService.getByPlanificacion(id);
    setCostos(updated);
  };

  // Itinerary handlers
  const handleAddDia = async (data: DiaItinerarioRequestDTO) => {
    await itinerarioService.createDia(data);
    const updated = await itinerarioService.getDiasByPlanificacion(id);
    setDias(updated);
  };
  const handleDeleteDia = async (diaId: number) => {
    await itinerarioService.deleteDia(diaId);
    const updated = await itinerarioService.getDiasByPlanificacion(id);
    setDias(updated);
  };
  const handleAddItem = async (data: ItemItinerarioRequestDTO) => {
    await itinerarioService.createItem(data);
    const updated = await itinerarioService.getDiasByPlanificacion(id);
    setDias(updated);
  };
  const handleDeleteItem = async (itemId: number) => {
    await itinerarioService.deleteItem(itemId);
    const updated = await itinerarioService.getDiasByPlanificacion(id);
    setDias(updated);
  };

  const totalGastos = costos.reduce((acc, c) => acc + (Number(c.monto) || 0), 0);

  if (error) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 shadow-sm"
        >
          <AlertCircle className="w-10 h-10" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">Error al cargar el viaje</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">{error || 'No se encontró la planificación solicitada.'}</p>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAllData}
            className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-6 py-3 rounded-2xl shadow-md shadow-[#FF5A5F]/20 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reintentar</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/planificaciones')}
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a mis viajes</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pb-24 font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
        
        {loading ? (
          <div className="space-y-8 mt-10">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : planificacion ? (
          <>
            {/* Header / Hero */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <TripDetailHeader
                planificacion={planificacion}
                destinosCount={destinos.length}
                actividadesCount={actividades.length}
                gastosTotal={totalGastos}
                diasCount={dias.length}
              />
            </motion.div>

            {/* Vertical Stack of Cards */}
            <motion.main 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-8 pb-12"
            >
              <motion.div variants={itemVariants}>
                <DetailDestinationsCard
                  planificacionId={id}
                  destinos={destinos}
                  onAddDestino={handleAddDestino}
                  onDeleteDestino={handleDeleteDestino}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DetailActivitiesCard
                  planificacionId={id}
                  fechaInicio={planificacion.fechaInicio}
                  fechaFin={planificacion.fechaFin}
                  destinos={destinos}
                  actividades={actividades}
                  onAddActividad={handleAddActividad}
                  onDeleteActividad={handleDeleteActividad}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DetailExpensesCard
                  planificacionId={id}
                  costos={costos}
                  onAddCosto={handleAddCosto}
                  onDeleteCosto={handleDeleteCosto}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DetailItineraryCard
                  planificacionId={id}
                  fechaInicio={planificacion.fechaInicio}
                  fechaFin={planificacion.fechaFin}
                  dias={dias}
                  actividades={actividades}
                  destinos={destinos}
                  onAddDia={handleAddDia}
                  onDeleteDia={handleDeleteDia}
                  onAddItem={handleAddItem}
                  onDeleteItem={handleDeleteItem}
                />
              </motion.div>
            </motion.main>
          </>
        ) : null}
        
      </div>
    </div>
  );
};
