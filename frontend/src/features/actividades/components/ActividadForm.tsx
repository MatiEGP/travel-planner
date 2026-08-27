import { useState, type FormEvent } from 'react';
import { actividadService } from '../api/actividadService';
import type { ActividadRequestDTO } from '../types/actividad';

interface ActividadFormProps {
  destinoId: number;
  onCreated: () => void;
}

export const ActividadForm = ({ destinoId, onCreated }: ActividadFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    fechaHora: '',
    notas: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const request: ActividadRequestDTO = {
      destinoId,
      nombre: formData.nombre,
      fechaHora: formData.fechaHora + ':00', // Add seconds for LocalDateTime format
      notas: formData.notas,
    };

    try {
      setSubmitting(true);
      setError(null);
      await actividadService.create(request);
      setFormData({ nombre: '', fechaHora: '', notas: '' });
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Agregar Actividad</h3>
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="act-nombre" className="block text-sm font-medium text-slate-700 mb-1.5">Nombre de la actividad</label>
          <input
            id="act-nombre"
            type="text"
            placeholder="Ej: Visita guiada al museo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400"
          />
        </div>
        <div>
          <label htmlFor="act-fecha" className="block text-sm font-medium text-slate-700 mb-1.5">Fecha y hora</label>
          <input
            id="act-fecha"
            type="datetime-local"
            value={formData.fechaHora}
            onChange={(e) => setFormData({ ...formData, fechaHora: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800"
          />
        </div>
        <div>
          <label htmlFor="act-notas" className="block text-sm font-medium text-slate-700 mb-1.5">Notas</label>
          <textarea
            id="act-notas"
            placeholder="Detalles adicionales..."
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
          {submitting ? 'Agregando...' : 'Agregar Actividad'}
        </button>
      </form>
    </div>
  );
};
