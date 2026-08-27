import React, { useState } from 'react';
import type { PlanificacionRequestDTO } from '../../types/planificacion';
import { useAuth } from '../../context/useAuth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlanificacionRequestDTO) => Promise<void>;
}

export const PlanificacionFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const { usuario } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        usuarioId: usuario.id,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
      });
      // Reset form on success
      setFormData({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '' });
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl shadow-teal-900/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600"></div>
        
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-white">Nuevo Viaje</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-200 text-sm flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="titulo" className="block text-sm font-semibold text-slate-300 mb-1.5">
                Título del Viaje
              </label>
              <input
                id="titulo"
                type="text"
                required
                placeholder="Ej: Escapada a la Patagonia"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-slate-900/50 text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-semibold text-slate-300 mb-1.5">
                Descripción
              </label>
              <textarea
                id="descripcion"
                rows={3}
                required
                placeholder="Un viaje para desconectar y conocer los glaciares..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-slate-900/50 text-white placeholder-slate-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fechaInicio" className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Fecha de Inicio
                </label>
                <input
                  id="fechaInicio"
                  type="date"
                  required
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-slate-900/50 text-white"
                />
              </div>
              <div>
                <label htmlFor="fechaFin" className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Fecha de Fin
                </label>
                <input
                  id="fechaFin"
                  type="date"
                  required
                  min={formData.fechaInicio} // Minimal validation
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-slate-900/50 text-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-900 bg-teal-500 hover:bg-teal-400 transition-all shadow-md hover:shadow-teal-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Viaje'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
