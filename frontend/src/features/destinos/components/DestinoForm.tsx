import { useState, type FormEvent } from 'react';
import { destinoService } from '../api/destinoService';
import type { DestinoRequestDTO } from '../types/destino';

interface DestinoFormProps {
  planificacionId: number;
  onCreated: () => void;
}

export const DestinoForm = ({ planificacionId, onCreated }: DestinoFormProps) => {
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
    const request: DestinoRequestDTO = {
      planificacionId,
      ...formData,
    };

    try {
      setSubmitting(true);
      setError(null);
      await destinoService.create(request);
      setFormData({ nombre: '', pais: '', ciudad: '', notas: '' });
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Agregar Destino</h3>
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="destino-nombre" className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del destino</label>
          <input
            id="destino-nombre"
            type="text"
            placeholder="Ej: Torre Eiffel, Coliseo Romano"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="destino-pais" className="block text-sm font-medium text-slate-700 mb-1.5">País</label>
            <input
              id="destino-pais"
              type="text"
              placeholder="Ej: Francia"
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
          <div>
            <label htmlFor="destino-ciudad" className="block text-sm font-medium text-slate-700 mb-1.5">Ciudad</label>
            <input
              id="destino-ciudad"
              type="text"
              placeholder="Ej: París"
              value={formData.ciudad}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
        <div>
          <label htmlFor="destino-notas" className="block text-sm font-medium text-slate-700 mb-1.5">Notas</label>
          <textarea
            id="destino-notas"
            placeholder="Notas adicionales..."
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            rows={2}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Agregando...' : 'Agregar Destino'}
        </button>
      </form>
    </div>
  );
};
