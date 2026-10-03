import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Plane, CheckCircle2, MapPin, Sparkles, DollarSign, CalendarDays } from 'lucide-react';
import type { PlanificacionResponseDTO } from '../../types/planificacion';
import { getTripStatus, formatDateRange, getTripCoverImage } from '../../../../utils/tripUtils';

interface TripDetailHeaderProps {
  planificacion: PlanificacionResponseDTO;
  destinosCount: number;
  actividadesCount: number;
  gastosTotal: number;
  diasCount: number;
}

export const TripDetailHeader: React.FC<TripDetailHeaderProps> = ({
  planificacion,
  destinosCount,
  actividadesCount,
  gastosTotal,
  diasCount,
}) => {
  const navigate = useNavigate();
  const status = getTripStatus(planificacion.fechaInicio, planificacion.fechaFin);
  const formattedDates = formatDateRange(planificacion.fechaInicio, planificacion.fechaFin);
  const coverImage = getTripCoverImage(planificacion.titulo, planificacion.id);

  const renderStatusBadge = () => {
    switch (status) {
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Próximo</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-emerald-800 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <Plane className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>En curso</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Finalizado</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 overflow-hidden mb-8 transition-colors duration-300">
      {/* Hero Banner Container */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={coverImage}
          alt={planificacion.titulo}
          className="w-full h-full object-cover"
        />
        {/* Soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={() => navigate('/planificaciones')}
            className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-semibold px-3.5 py-2 rounded-full shadow-sm backdrop-blur-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] border border-slate-200/50 dark:border-slate-700/50"
            aria-label="Volver a mis viajes"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Mis viajes</span>
          </button>
          <div>{renderStatusBadge()}</div>
        </div>

        {/* Title & Dates on Hero */}
        <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-3 border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-[#FF5A5F]" />
            <span>Viaje planeado: {formattedDates}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm mb-2 text-white">
            {planificacion.titulo}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 drop-shadow-md max-w-2xl font-medium">
            {planificacion.descripcion ? `${planificacion.descripcion} • ` : ''}
            Explorando {destinosCount} {destinosCount === 1 ? 'destino' : 'destinos'} con {actividadesCount} {actividadesCount === 1 ? 'actividad' : 'actividades'}.
          </p>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/50 dark:divide-slate-800/50 p-4 sm:p-5 bg-transparent">
        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-[#FF5A5F]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{destinosCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Destinos</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{actividadesCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Actividades</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#10B981]">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#10B981]">${gastosTotal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gastos Totales</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{diasCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Días Itinerario</div>
          </div>
        </div>
      </div>
    </div>
  );
};
