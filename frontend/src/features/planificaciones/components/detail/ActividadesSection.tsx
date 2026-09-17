import React, { useState, type FormEvent } from 'react';
import { Sparkles, Plus, Trash2, X, AlertCircle, Clock, Calendar, MapPin } from 'lucide-react';
import type { ActividadResponseDTO, ActividadRequestDTO } from '../../../actividades/types/actividad';
import type { DestinoResponseDTO } from '../../../destinos/types/destino';

interface ActividadesSectionProps {
  planificacionId: number;
  fechaInicio: string;
  fechaFin: string;
  destinos: DestinoResponseDTO[];
  actividades: ActividadResponseDTO[];
  onAddActividad: (data: ActividadRequestDTO) => Promise<void>;
  onDeleteActividad: (id: number) => Promise<void>;
  openModalTrigger?: number;
}

export const ActividadesSection: React.FC<ActividadesSectionProps> = ({
  planificacionId,
  fechaInicio,
  fechaFin,
  destinos,
  actividades,
  onAddActividad,
  onDeleteActividad,
  openModalTrigger,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    destinoId: destinos.length > 0 ? destinos[0].id : 0,
    nombre: '',
    fechaHora: '',
    notas: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (defaultDestinoId?: number) => {
    setFormData({
      destinoId: defaultDestinoId || (destinos.length > 0 ? destinos[0].id : 0),
      nombre: '',
      fechaHora: '',
      notas: '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  React.useEffect(() => {
    if (openModalTrigger && openModalTrigger > 0) {
      handleOpenModal();
      document.getElementById('section-actividades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [openModalTrigger]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.fechaHora) {
      setError('Por favor complete los campos obligatorios.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      // Ensure ISO format YYYY-MM-DDTHH:MM:SS
      const formattedFechaHora = formData.fechaHora.includes(':00', 16)
        ? formData.fechaHora
        : formData.fechaHora.length === 16
        ? `${formData.fechaHora}:00`
        : formData.fechaHora;

      await onAddActividad({
        planificacionId,
        ...(Number(formData.destinoId) !== 0 ? { destinoId: Number(formData.destinoId) } : {}),
        nombre: formData.nombre.trim(),
        fechaHora: formattedFechaHora,
        notas: formData.notas.trim(),
      });
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message || 'Error al registrar actividad');
    } finally {
      setSubmitting(false);
    }
  };

  const formatActivityDateTime = (isoString: string) => {
    if (!isoString) return { date: '', time: '' };
    try {
      const dateObj = new Date(isoString);
      if (isNaN(dateObj.getTime())) return { date: isoString, time: '' };
      const date = dateObj.toLocaleDateString('es-AR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });
      const time = dateObj.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return { date, time };
    } catch {
      return { date: isoString, time: '' };
    }
  };

  // Group activities by destino
  const groupedActivities = destinos.map((dest) => ({
    destino: dest,
    items: actividades.filter((act) => act.destinoId === dest.id),
  }));

  // Also include unassigned activities if any
  const unassigned = actividades.filter(
    (act) => !act.destinoId || !destinos.some((d) => d.id === act.destinoId)
  );

  return (
    <section id="section-actividades" className="mb-10 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-[#222222]">Actividades</h2>
          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
            {actividades.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          title="Agregar actividad"
          className="inline-flex items-center gap-1.5 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Actividad</span>
        </button>
      </div>

      {/* Empty State */}
      {actividades.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Sin actividades planeadas</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            Organiza tus visitas a monumentos, museos, tours y reservas organizadas por destino.
          </p>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar primera actividad</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedActivities.map(({ destino, items }) => (
            <div
              key={destino.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF5A5F]" />
                  <h3 className="font-bold text-slate-800 text-base">{destino.nombre}</h3>
                  <span className="text-xs text-slate-400 font-medium">
                    ({destino.ciudad}, {destino.pais})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenModal(destino.id)}
                  className="text-xs font-semibold text-[#FF5A5F] hover:text-[#e0484d] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              {/* Activities List */}
              {items.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No hay actividades registradas para este destino.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {items.map((act) => {
                    const { date, time } = formatActivityDateTime(act.fechaHora);
                    return (
                      <div
                        key={act.id}
                        className="py-3 flex items-start justify-between gap-3 group hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">{act.nombre}</h4>
                            {time && (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                <Clock className="w-3 h-3" />
                                {time}
                              </span>
                            )}
                            {date && (
                              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {date}
                              </span>
                            )}
                          </div>
                          {act.notas && (
                            <p className="text-xs text-slate-500 mt-1">{act.notas}</p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteActividad(act.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                          title="Eliminar actividad"
                          aria-label={`Eliminar ${act.nombre}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {unassigned.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Otras actividades</h3>
              <div className="divide-y divide-slate-100">
                {unassigned.map((act) => {
                  const { date, time } = formatActivityDateTime(act.fechaHora);
                  return (
                    <div
                      key={act.id}
                      className="py-3 flex items-start justify-between gap-3 group hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{act.nombre}</h4>
                          {time && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                              <Clock className="w-3 h-3" />
                              {time}
                            </span>
                          )}
                          {date && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {date}
                            </span>
                          )}
                        </div>
                        {act.notas && (
                          <p className="text-xs text-slate-500 mt-1">{act.notas}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteActividad(act.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar actividad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#222222]">Nueva Actividad</h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-act-destino" className="block text-xs font-semibold text-slate-700 mb-1">
                  Destino asociado (Opcional)
                </label>
                <select
                  id="modal-act-destino"
                  value={formData.destinoId}
                  onChange={(e) => setFormData({ ...formData, destinoId: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white text-slate-800"
                >
                  <option value={0}>Sin destino específico</option>
                  {destinos.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.nombre} ({dest.ciudad})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="modal-act-nombre" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de la actividad *
                </label>
                <input
                  id="modal-act-nombre"
                  type="text"
                  placeholder="Ej: Tour guiado, Reserva restaurante, Visita museo"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="modal-act-fecha" className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha y Hora *
                </label>
                <input
                  id="modal-act-fecha"
                  type="datetime-local"
                  value={formData.fechaHora}
                  onChange={(e) => setFormData({ ...formData, fechaHora: e.target.value })}
                  min={`${fechaInicio}T00:00`}
                  max={`${fechaFin}T23:59`}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white"
                />
              </div>

              <div>
                <label htmlFor="modal-act-notas" className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas / Detalles
                </label>
                <textarea
                  id="modal-act-notas"
                  placeholder="Número de reserva, dirección, ropa recomendada..."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold bg-[#FF5A5F] hover:bg-[#e0484d] text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Guardar Actividad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
