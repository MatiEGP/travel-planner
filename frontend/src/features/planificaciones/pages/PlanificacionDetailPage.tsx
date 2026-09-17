import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
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
import { TripAnchorNav } from '../components/detail/TripAnchorNav';
import { TripBottomNav } from '../components/detail/TripBottomNav';
import { DestinosSection } from '../components/detail/DestinosSection';
import { ActividadesSection } from '../components/detail/ActividadesSection';
import { GastosSection } from '../components/detail/GastosSection';
import { ItinerarioSection } from '../components/detail/ItinerarioSection';
import { TripDetailSidebar } from '../components/detail/TripDetailSidebar';

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
    let isCancelled = false;

    if (isNaN(id)) {
      return;
    }

    setLoading(true);

    Promise.all([
      planificacionService.getById(id),
      destinoService.getByPlanificacion(id),
      actividadService.getByPlanificacion(id),
      costoService.getByPlanificacion(id),
      itinerarioService.getDiasByPlanificacion(id),
    ])
      .then(([planRes, destRes, actRes, costRes, diasRes]) => {
        if (!isCancelled) {
          setPlanificacion(planRes);
          setDestinos(destRes || []);
          setActividades(actRes || []);
          setCostos(costRes || []);
          setDias(diasRes || []);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError((err as Error).message || 'Error al cargar los detalles del viaje.');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Destination mutation handlers
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

  // Activity mutation handlers
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

  // Cost mutation handlers
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

  // Itinerary mutation handlers
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

  // Quick Action Handler from Sidebar
  const handleQuickAction = (action: 'destino' | 'actividad' | 'gasto' | 'dia') => {
    const sectionMap = {
      destino: 'section-destinos',
      actividad: 'section-actividades',
      gasto: 'section-gastos',
      dia: 'section-itinerario',
    };
    const targetId = sectionMap[action];
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalGastos = costos.reduce((acc, c) => acc + (Number(c.monto) || 0), 0);

  if (loading) {
    return (
      <div className="flex-1 bg-[#F7F9FA] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#FF5A5F] mb-4" />
        <p className="text-slate-600 font-semibold text-sm">Cargando itinerario de viaje...</p>
      </div>
    );
  }

  if (error || !planificacion) {
    return (
      <div className="flex-1 bg-[#F7F9FA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Error al cargar el viaje</h2>
        <p className="text-slate-500 max-w-md mb-6">{error || 'No se encontró la planificación solicitada.'}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAllData}
            className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/planificaciones')}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mis viajes</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F7F9FA] text-[#222222] pb-24 lg:pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Full-width Hero Header */}
        <TripDetailHeader
          planificacion={planificacion}
          destinosCount={destinos.length}
          actividadesCount={actividades.length}
          gastosTotal={totalGastos}
          diasCount={dias.length}
        />

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Column: Sticky Anchor Navigation (Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <TripAnchorNav
              destinosCount={destinos.length}
              actividadesCount={actividades.length}
              gastosCount={costos.length}
              diasCount={dias.length}
            />
          </div>

          {/* Center Column: Content Stream */}
          <main className="col-span-1 lg:col-span-6 space-y-2">
            <DestinosSection
              planificacionId={id}
              destinos={destinos}
              onAddDestino={handleAddDestino}
              onDeleteDestino={handleDeleteDestino}
            />

            <ActividadesSection
              planificacionId={id}
              fechaInicio={planificacion.fechaInicio}
              fechaFin={planificacion.fechaFin}
              destinos={destinos}
              actividades={actividades}
              onAddActividad={handleAddActividad}
              onDeleteActividad={handleDeleteActividad}
            />

            <GastosSection
              planificacionId={id}
              costos={costos}
              onAddCosto={handleAddCosto}
              onDeleteCosto={handleDeleteCosto}
            />

            <ItinerarioSection
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
          </main>

          {/* Right Column: Sticky Quick Actions + Trip Summary */}
          <div className="hidden lg:block lg:col-span-3">
            <TripDetailSidebar
              planificacion={planificacion}
              destinosCount={destinos.length}
              actividadesCount={actividades.length}
              gastosTotal={totalGastos}
              diasCount={dias.length}
              onQuickAction={handleQuickAction}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <TripBottomNav
        destinosCount={destinos.length}
        actividadesCount={actividades.length}
        gastosCount={costos.length}
        diasCount={dias.length}
      />
    </div>
  );
};
