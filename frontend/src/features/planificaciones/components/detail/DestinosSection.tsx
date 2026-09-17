import React, { useState, type FormEvent } from 'react';
import { MapPin, Plus, Trash2, X, AlertCircle } from 'lucide-react';
import type { DestinoResponseDTO, DestinoRequestDTO } from '../../../destinos/types/destino';
import { getTripCoverImage } from '../../../../utils/tripUtils';

interface DestinosSectionProps {
  planificacionId: number;
  destinos: DestinoResponseDTO[];
  onAddDestino: (data: DestinoRequestDTO) => Promise<void>;
  onDeleteDestino: (id: number) => Promise<void>;
  openModalTrigger?: number;
}

export const DestinosSection: React.FC<DestinosSectionProps> = ({
  planificacionId,
  destinos,
  onAddDestino,
  onDeleteDestino,
  openModalTrigger,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    pais: '',
    ciudad: '',
    notas: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = () => {
    setFormData({ nombre: '', pais: '', ciudad: '', notas: '' });
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  React.useEffect(() => {
    if (openModalTrigger && openModalTrigger > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleOpenModal();
      document.getElementById('section-destinos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
     
  }, [openModalTrigger]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.pais.trim() || !formData.ciudad.trim()) {
      setError('Por favor complete los campos obligatorios.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAddDestino({
        planificacionId,
        nombre: formData.nombre.trim(),
        pais: formData.pais.trim(),
        ciudad: formData.ciudad.trim(),
        notas: formData.notas.trim(),
      });
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message || 'Error al agregar destino');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="section-destinos" className="mb-10 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-[#FF5A5F]">
            <MapPin className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-[#222222]">Destinos</h2>
          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
            {destinos.length}
          </span>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-1.5 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Destino</span>
        </button>
      </div>

      {/* Destination Cards List */}
      {destinos.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center">
          <div className="w-12 h-12 bg-rose-50 text-[#FF5A5F] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Sin destinos registrados</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            Agrega las ciudades y lugares que vas a visitar durante tu viaje.
          </p>
          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar primer destino</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {destinos.map((destino) => {
            const destCover = getTripCoverImage(destino.nombre || destino.ciudad, destino.id);

            return (
              <div
                key={destino.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative"
              >
                {/* 16:9 Photo */}
                <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={destCover}
                    alt={destino.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Location badge on photo */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF5A5F]" />
                      {destino.ciudad}, {destino.pais}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => onDeleteDestino(destino.id)}
                    className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-white shadow-xs transition-all hover:scale-110"
                    title="Eliminar destino"
                    aria-label={`Eliminar destino ${destino.nombre}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-base text-[#222222] mb-1 line-clamp-1">
                    {destino.nombre}
                  </h3>
                  {destino.notas ? (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{destino.notas}</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-1">Sin notas adicionales.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Destino Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-[#FF5A5F]">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#222222]">Nuevo Destino</h3>
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
                <label htmlFor="modal-dest-nombre" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del destino *
                </label>
                <input
                  id="modal-dest-nombre"
                  type="text"
                  placeholder="Ej: Coliseo y Foro Romano, Torre Eiffel"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-dest-ciudad" className="block text-xs font-semibold text-slate-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    id="modal-dest-ciudad"
                    type="text"
                    placeholder="Ej: Roma"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="modal-dest-pais" className="block text-xs font-semibold text-slate-700 mb-1">
                    País *
                  </label>
                  <input
                    id="modal-dest-pais"
                    type="text"
                    placeholder="Ej: Italia"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-dest-notas" className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas o tips
                </label>
                <textarea
                  id="modal-dest-notas"
                  placeholder="Detalles sobre transporte, reservas, horarios recomendados..."
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
                  {submitting ? 'Guardando...' : 'Guardar Destino'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
