import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { PlanificacionRequestDTO } from '../../types/planificacion';
import { useAuth } from '../../context/useAuth';

interface PlanificacionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlanificacionRequestDTO) => Promise<void>;
}

export const PlanificacionFormModal: React.FC<PlanificacionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { usuario } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when modal closes
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (!isOpen && prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    setFormData({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '' });
    setError(null);
  } else if (isOpen && prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) {
      setError('Debes iniciar sesión para crear una planificación.');
      return;
    }

    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.fechaInicio || !formData.fechaFin) {
      setError('Por favor completá todos los campos requeridos.');
      return;
    }

    if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio > formData.fechaFin) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        usuarioId: usuario.id,
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Error al crear la planificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-[#FF5A5F] to-rose-400" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-rose-50 text-[#FF5A5F] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 id="modal-title" className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Crear Planificación
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-2.5"
              role="alert"
            >
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="titulo"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Título del Viaje *
              </label>
              <input
                id="titulo"
                type="text"
                required
                placeholder="Ej: Aventura en Bariloche"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full bg-[#F1F3F4] text-slate-900 rounded-xl px-4 py-3 border-0 focus:bg-white focus:ring-2 focus:ring-[#FF5A5F] outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Descripción *
              </label>
              <textarea
                id="descripcion"
                rows={3}
                required
                placeholder="Ej: Un viaje inolvidable por los lagos, cerros y bosques..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full bg-[#F1F3F4] text-slate-900 rounded-xl px-4 py-3 border-0 focus:bg-white focus:ring-2 focus:ring-[#FF5A5F] outline-none transition-all placeholder:text-slate-400 resize-none font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fechaInicio"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
                >
                  Fecha de Inicio *
                </label>
                <input
                  id="fechaInicio"
                  type="date"
                  required
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  className="w-full bg-[#F1F3F4] text-slate-900 rounded-xl px-4 py-3 border-0 focus:bg-white focus:ring-2 focus:ring-[#FF5A5F] outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label
                  htmlFor="fechaFin"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
                >
                  Fecha de Fin *
                </label>
                <input
                  id="fechaFin"
                  type="date"
                  required
                  min={formData.fechaInicio}
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  className="w-full bg-[#F1F3F4] text-slate-900 rounded-xl px-4 py-3 border-0 focus:bg-white focus:ring-2 focus:ring-[#FF5A5F] outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-full font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF5A5F] hover:bg-[#E0484D] text-white font-bold py-3 px-7 rounded-full shadow-md hover:shadow-rose-500/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Crear Viaje</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
