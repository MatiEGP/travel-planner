import { useState, type FormEvent } from 'react';
import { destinoService } from '../api/destinoService';
import type { DestinoRequestDTO } from '../types/destino';

interface DestinoFormProps {
  planificacionId?: number;
  onCreated?: () => void;
  onSubmit?: (data: Omit<DestinoRequestDTO, 'planificacionId'> & { planificacionId?: number }) => Promise<void>;
  onCancel?: () => void;
}

export const DestinoForm = ({ planificacionId, onCreated, onSubmit, onCancel }: DestinoFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    pais: '',
    ciudad: '',
    notas: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const request = {
      ...(planificacionId ? { planificacionId } : {}),
      ...formData,
    };

    try {
      setSubmitting(true);
      setError(null);
      if (onSubmit) {
        await onSubmit(request);
      } else {
        await destinoService.create(request as DestinoRequestDTO);
      }
      setFormData({ nombre: '', pais: '', ciudad: '', notas: '' });
      if (onCreated) onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Agregar Destino</h3>
      {error && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="destino-nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre del destino <span className="text-rose-500">*</span></label>
          <input
            id="destino-nombre"
            type="text"
            placeholder="Ej: Torre Eiffel, Coliseo Romano"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-colors duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="destino-pais" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">País <span className="text-rose-500">*</span></label>
            <input
              id="destino-pais"
              type="text"
              placeholder="Ej: Francia"
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-colors duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400"
            />
          </div>
          <div>
            <label htmlFor="destino-ciudad" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ciudad <span className="text-rose-500">*</span></label>
            <input
              id="destino-ciudad"
              type="text"
              placeholder="Ej: París"
              value={formData.ciudad}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-colors duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>
        <div>
          <label htmlFor="destino-notas" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notas</label>
          <textarea
            id="destino-notas"
            placeholder="Notas adicionales..."
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            rows={2}
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-colors duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400 resize-none"
          />
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-[#FF5A5F] hover:bg-[#e0484d] text-white font-semibold py-2.5 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Agregando...' : 'Guardar Destino'}
          </button>
        </div>
      </form>
    </div>
  );
};
