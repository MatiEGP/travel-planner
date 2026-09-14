import React, { useState, useMemo, type FormEvent } from 'react';
import { CalendarDays, Plus, Trash2, X, AlertCircle, Clock, Sparkles, MapPin } from 'lucide-react';
import type {
  DiaItinerarioResponseDTO,
  DiaItinerarioRequestDTO,
  ItemItinerarioRequestDTO,
  ItemItinerarioResponseDTO,
} from '../../types/itinerario';
import type { ActividadResponseDTO } from '../../../actividades/types/actividad';
import type { DestinoResponseDTO } from '../../../destinos/types/destino';

interface ItinerarioSectionProps {
  planificacionId: number;
  fechaInicio: string;
  fechaFin: string;
  dias: DiaItinerarioResponseDTO[];
  actividades: ActividadResponseDTO[];
  destinos?: DestinoResponseDTO[];
  onAddDia: (data: DiaItinerarioRequestDTO) => Promise<void>;
  onDeleteDia: (id: number) => Promise<void>;
  onAddItem: (data: ItemItinerarioRequestDTO) => Promise<void>;
  onDeleteItem: (id: number) => Promise<void>;
}

export const ItinerarioSection: React.FC<ItinerarioSectionProps> = ({
  planificacionId,
  fechaInicio,
  fechaFin,
  dias,
  actividades = [],
  destinos = [],
  onAddDia,
  onDeleteDia,
  onAddItem,
  onDeleteItem,
}) => {
  // Sort days chronologically
  const sortedDias = useMemo(() => {
    return [...dias].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [dias]);

  const [selectedDiaId, setSelectedDiaId] = useState<number | null>(null);

  // Maintain selected day fallback
  const activeDia = useMemo(() => {
    if (sortedDias.length === 0) return null;
    if (selectedDiaId) {
      const found = sortedDias.find((d) => d.id === selectedDiaId);
      if (found) return found;
    }
    return sortedDias[0];
  }, [sortedDias, selectedDiaId]);

  // Modals state
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [newDayFecha, setNewDayFecha] = useState('');
  const [itemFormData, setItemFormData] = useState<{
    tipo: 'ACTIVIDAD' | 'DESTINO';
    referenciaId: string;
    horaInicio: string;
    horaFin: string;
    notas: string;
  }>({
    tipo: 'ACTIVIDAD',
    referenciaId: '',
    horaInicio: '',
    horaFin: '',
    notas: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenDayModal = () => {
    setNewDayFecha('');
    setError(null);
    setIsDayModalOpen(true);
  };

  const handleOpenItemModal = () => {
    const defaultTipo = 'ACTIVIDAD';
    const defaultRefId = actividades.length > 0 ? String(actividades[0].id) : '';
    setItemFormData({
      tipo: defaultTipo,
      referenciaId: defaultRefId,
      horaInicio: '',
      horaFin: '',
      notas: '',
    });
    setError(null);
    setIsItemModalOpen(true);
  };

  const handleTipoChange = (newTipo: 'ACTIVIDAD' | 'DESTINO') => {
    let defaultRefId = '';
    if (newTipo === 'ACTIVIDAD' && actividades.length > 0) {
      defaultRefId = String(actividades[0].id);
    } else if (newTipo === 'DESTINO' && destinos && destinos.length > 0) {
      defaultRefId = String(destinos[0].id);
    }
    setItemFormData((prev) => ({
      ...prev,
      tipo: newTipo,
      referenciaId: defaultRefId,
    }));
  };

  const handleAddDaySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDayFecha) {
      setError('Por favor seleccione una fecha.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAddDia({
        planificacionId,
        fecha: newDayFecha,
      });
      setIsDayModalOpen(false);
    } catch (err) {
      setError((err as Error).message || 'Error al agregar día');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddItemSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeDia) return;
    if (!itemFormData.referenciaId) {
      setError(
        itemFormData.tipo === 'ACTIVIDAD'
          ? 'Por favor seleccione una actividad.'
          : 'Por favor seleccione un destino.'
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAddItem({
        diaItinerarioId: activeDia.id,
        tipo: itemFormData.tipo,
        referenciaId: Number(itemFormData.referenciaId),
        horaInicio: itemFormData.horaInicio || undefined,
        horaFin: itemFormData.horaFin || undefined,
        notas: itemFormData.notas.trim() || undefined,
      });
      setIsItemModalOpen(false);
    } catch (err) {
      setError((err as Error).message || 'Error al agregar item al itinerario');
    } finally {
      setSubmitting(false);
    }
  };

  const getItemDetails = (item: ItemItinerarioResponseDTO) => {
    if (item.tipo === 'ACTIVIDAD' || !item.tipo) {
      const act = actividades.find((a) => a.id === item.referenciaId);
      return {
        nombre: act ? act.nombre : item.notas || 'Actividad',
        tipoLabel: 'Actividad',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Sparkles,
        iconColor: 'text-amber-500',
        subtext: act?.notas && act.notas !== item.notas ? act.notas : undefined,
      };
    }
    if (item.tipo === 'DESTINO') {
      const dest = destinos?.find((d) => d.id === item.referenciaId);
      return {
        nombre: dest ? `${dest.nombre} (${dest.ciudad})` : item.notas || 'Destino',
        tipoLabel: 'Destino',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: MapPin,
        iconColor: 'text-rose-500',
        subtext: dest ? `${dest.ciudad}, ${dest.pais}` : undefined,
      };
    }
    return {
      nombre: item.notas || item.tipo,
      tipoLabel: item.tipo,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Clock,
      iconColor: 'text-sky-500',
      subtext: undefined,
    };
  };

  const formatDayTabDate = (fechaStr: string) => {
    try {
      const parts = fechaStr.split('T')[0].split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
      }
      return fechaStr;
    } catch {
      return fechaStr;
    }
  };

  const formatFullDayDate = (fechaStr: string) => {
    try {
      const parts = fechaStr.split('T')[0].split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('es-AR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      return fechaStr;
    } catch {
      return fechaStr;
    }
  };

  const sortedItems = useMemo(() => {
    if (!activeDia || !activeDia.items) return [];
    return [...activeDia.items].sort((a, b) => {
      const timeA = a.horaInicio || '99:99';
      const timeB = b.horaInicio || '99:99';
      return timeA.localeCompare(timeB);
    });
  }, [activeDia]);

  return (
    <section id="section-itinerario" className="mb-10 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500">
            <CalendarDays className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-[#222222]">Itinerario Día por Día</h2>
          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
            {sortedDias.length} {sortedDias.length === 1 ? 'día' : 'días'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleOpenDayModal}
          className="inline-flex items-center gap-1.5 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Día</span>
        </button>
      </div>

      {sortedDias.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center">
          <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Sin días organizados</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            Estructura tu viaje agregando los días y asignando actividades cronológicas con horarios.
          </p>
          <button
            type="button"
            onClick={handleOpenDayModal}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar primer día</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Chronological Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {sortedDias.map((dia, index) => {
              const isSelected = activeDia?.id === dia.id;
              const formattedDate = formatDayTabDate(dia.fecha);
              const itemsCount = dia.items?.length || 0;

              return (
                <button
                  key={dia.id}
                  type="button"
                  onClick={() => setSelectedDiaId(dia.id)}
                  className={`flex flex-col items-start px-4 py-2.5 rounded-2xl border text-left shrink-0 transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-102'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Día {index + 1}
                    </span>
                    {itemsCount > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {itemsCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-extrabold capitalize ${
                      isSelected ? 'text-white' : 'text-[#222222]'
                    }`}
                  >
                    {formattedDate}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Day Detail Card */}
          {activeDia && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              {/* Active Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cronograma del día
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#222222] capitalize">
                    {formatFullDayDate(activeDia.fecha)}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenItemModal}
                    className="inline-flex items-center gap-1 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Actividad</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteDia(activeDia.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Eliminar este día"
                    aria-label="Eliminar este día"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              {sortedItems.length === 0 ? (
                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">Sin actividades para este día</p>
                  <p className="text-xs text-slate-500 mb-3">Organiza los horarios de tus visitas y traslados.</p>
                  <button
                    type="button"
                    onClick={handleOpenItemModal}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A5F] hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Agregar primer item</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-4 before:w-0.5 before:bg-slate-100">
                  {sortedItems.map((item) => {
                    const details = getItemDetails(item);
                    const IconComponent = details.icon;

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3.5 p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors relative"
                      >
                        {/* Timeline dot */}
                        <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0 z-10">
                          <IconComponent className={`w-4 h-4 ${details.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md">
                              {item.horaInicio || 'Flexible'} {item.horaFin ? `— ${item.horaFin}` : ''}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${details.badgeClass}`}>
                              {details.tipoLabel}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#222222]">
                            {details.nombre}
                          </h4>

                          {item.notas && item.notas !== details.nombre && (
                            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                              {item.notas}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Eliminar actividad"
                          aria-label="Eliminar actividad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Day Modal */}
      {isDayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#222222]">Nuevo Día</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDayModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddDaySubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-day-fecha" className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha del itinerario *
                </label>
                <input
                  id="modal-day-fecha"
                  type="date"
                  value={newDayFecha}
                  onChange={(e) => setNewDayFecha(e.target.value)}
                  min={fechaInicio}
                  max={fechaFin}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDayModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold bg-[#FF5A5F] hover:bg-[#e0484d] text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Crear Día'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#222222]">Nueva Actividad / Item</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddItemSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-item-tipo" className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de item *
                </label>
                <select
                  id="modal-item-tipo"
                  value={itemFormData.tipo}
                  onChange={(e) => handleTipoChange(e.target.value as 'ACTIVIDAD' | 'DESTINO')}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white text-slate-800"
                >
                  <option value="ACTIVIDAD">Actividad</option>
                  <option value="DESTINO">Destino</option>
                </select>
              </div>

              {itemFormData.tipo === 'ACTIVIDAD' ? (
                <div>
                  <label htmlFor="modal-item-referencia" className="block text-xs font-semibold text-slate-700 mb-1">
                    Seleccionar Actividad *
                  </label>
                  {actividades.length === 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>No hay actividades registradas en este viaje. Agrega actividades en la sección de Actividades primero.</span>
                    </div>
                  ) : (
                    <select
                      id="modal-item-referencia"
                      value={itemFormData.referenciaId}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const act = actividades.find(a => String(a.id) === selectedId);
                        setItemFormData({ 
                          ...itemFormData, 
                          referenciaId: selectedId,
                          horaInicio: act?.fechaHora ? act.fechaHora.split('T')[1].substring(0, 5) : itemFormData.horaInicio
                        });
                      }}
                      required
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white text-slate-800"
                    >
                      <option value="">-- Seleccionar actividad --</option>
                      {actividades.map((act) => (
                        <option key={act.id} value={act.id}>
                          {act.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <div>
                  <label htmlFor="modal-item-referencia" className="block text-xs font-semibold text-slate-700 mb-1">
                    Seleccionar Destino *
                  </label>
                  {!destinos || destinos.length === 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>No hay destinos registrados en este viaje. Agrega destinos en la sección de Destinos primero.</span>
                    </div>
                  ) : (
                    <select
                      id="modal-item-referencia"
                      value={itemFormData.referenciaId}
                      onChange={(e) => setItemFormData({ ...itemFormData, referenciaId: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white text-slate-800"
                    >
                      <option value="">-- Seleccionar destino --</option>
                      {destinos.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.nombre} ({dest.ciudad}, {dest.pais})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-item-inicio" className="block text-xs font-semibold text-slate-700 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    id="modal-item-inicio"
                    type="time"
                    value={itemFormData.horaInicio}
                    onChange={(e) => setItemFormData({ ...itemFormData, horaInicio: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="modal-item-fin" className="block text-xs font-semibold text-slate-700 mb-1">
                    Hora Fin
                  </label>
                  <input
                    id="modal-item-fin"
                    type="time"
                    value={itemFormData.horaFin}
                    onChange={(e) => setItemFormData({ ...itemFormData, horaFin: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-item-notas" className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas / Observaciones
                </label>
                <textarea
                  id="modal-item-notas"
                  placeholder="Detalles sobre este momento del día, punto de encuentro..."
                  value={itemFormData.notas}
                  onChange={(e) => setItemFormData({ ...itemFormData, notas: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    (itemFormData.tipo === 'ACTIVIDAD' && actividades.length === 0) ||
                    (itemFormData.tipo === 'DESTINO' && (!destinos || destinos.length === 0))
                  }
                  className="px-5 py-2 text-sm font-semibold bg-[#FF5A5F] hover:bg-[#e0484d] text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Guardar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
