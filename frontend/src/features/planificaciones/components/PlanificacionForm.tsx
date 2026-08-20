import { useState, type FormEvent } from 'react';
import { planificacionService } from '../api/planificacionService';
import type { PlanificacionRequestDTO } from '../types/planificacion';
import { useAuth } from '../../auth/context/useAuth';

interface PlanificacionFormProps {
  onCreated: () => void;
}

export const PlanificacionForm = ({ onCreated }: PlanificacionFormProps) => {
  const { usuario } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const request: PlanificacionRequestDTO = {
      usuarioId: usuario.id,
      ...formData,
    };

    try {
      setSubmitting(true);
      setError(null);
      await planificacionService.create(request);
      setFormData({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '' });
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Crear Nueva Planificación</h3>
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="plan-titulo" className="block text-sm font-medium text-slate-700 mb-1.5">Título del viaje</label>
          <input
            id="plan-titulo"
            type="text"
            placeholder="Ej: Vacaciones en Europa"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400"
          />
        </div>
        <div>
          <label htmlFor="plan-descripcion" className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
          <textarea
            id="plan-descripcion"
            placeholder="Describí tu viaje..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="plan-fecha-inicio" className="block text-sm font-medium text-slate-700 mb-1.5">Fecha de inicio</label>
            <input
              id="plan-fecha-inicio"
              type="date"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800"
            />
          </div>
          <div>
            <label htmlFor="plan-fecha-fin" className="block text-sm font-medium text-slate-700 mb-1.5">Fecha de fin</label>
            <input
              id="plan-fecha-fin"
              type="date"
              value={formData.fechaFin}
              onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creando...' : 'Crear Planificación'}
        </button>
      </form>
    </div>
  );
};
