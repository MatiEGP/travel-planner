import React from 'react';
import { Plus, MapPin, Sparkles, CreditCard, CalendarDays, Calendar, Clock } from 'lucide-react';
import type { PlanificacionResponseDTO } from '../../types/planificacion';
import { formatDateRange, parseLocalDate } from '../../../../utils/tripUtils';

interface TripDetailSidebarProps {
  planificacion: PlanificacionResponseDTO;
  destinosCount: number;
  actividadesCount: number;
  gastosTotal: number;
  diasCount: number;
  isHeaderVisible?: boolean;
  onQuickAction: (action: 'destino' | 'actividad' | 'gasto' | 'dia') => void;
}

export const TripDetailSidebar: React.FC<TripDetailSidebarProps> = ({
  planificacion,
  destinosCount,
  actividadesCount,
  gastosTotal,
  diasCount,
  isHeaderVisible = true,
  onQuickAction,
}) => {
  const formattedDates = formatDateRange(planificacion.fechaInicio, planificacion.fechaFin);

  const calculateDurationDays = () => {
    const start = parseLocalDate(planificacion.fechaInicio);
    const end = parseLocalDate(planificacion.fechaFin);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const durationDays = calculateDurationDays();

  return (
    <aside className="space-y-6" aria-label="Acciones rápidas y resumen del viaje">
      {/* Quick Actions Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Acciones Rápidas
        </h3>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onQuickAction('destino')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50/60 hover:bg-rose-50 text-[#FF5A5F] text-xs font-bold transition-all hover:scale-101 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shadow-xs">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span>Agregar Destino</span>
            </div>
            <Plus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction('actividad')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 hover:bg-amber-50 text-amber-700 text-xs font-bold transition-all hover:scale-101 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shadow-xs text-amber-500">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Agregar Actividad</span>
            </div>
            <Plus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction('gasto')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 text-[#10B981] text-xs font-bold transition-all hover:scale-101 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shadow-xs text-[#10B981]">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span>Registrar Gasto</span>
            </div>
            <Plus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction('dia')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-sky-50/60 hover:bg-sky-50 text-sky-700 text-xs font-bold transition-all hover:scale-101 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shadow-xs text-sky-500">
                <CalendarDays className="w-3.5 h-3.5" />
              </div>
              <span>Nuevo Día Itinerario</span>
            </div>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini Calendar / Trip Summary Widget */}
      {!isHeaderVisible && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Resumen del Viaje
            </h3>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
            <div className="text-xs text-slate-500 font-medium mb-0.5">Fechas del Viaje</div>
            <div className="text-sm font-bold text-slate-900">{formattedDates}</div>
            {durationDays && (
              <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{durationDays} días totales de viaje</span>
              </div>
            )}
          </div>

          <div className="space-y-2.5 px-1 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A5F]" />
                <span>Destinos</span>
              </span>
              <span className="font-bold text-slate-900">{destinosCount}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Actividades</span>
              </span>
              <span className="font-bold text-slate-900">{actividadesCount}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-sky-500" />
                <span>Días planificados</span>
              </span>
              <span className="font-bold text-slate-900">{diasCount}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Presupuesto</span>
              </span>
              <span className="font-extrabold text-sm text-[#10B981]">
                ${gastosTotal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
