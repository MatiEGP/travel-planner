import { useState, type FormEvent } from 'react';
import { actividadService } from '../api/actividadService';
import type { ActividadRequestDTO } from '../types/actividad';
import { PopoverDatePicker } from '../../../components/ui/PopoverDatePicker';
import { TimePicker } from '../../../components/ui/TimePicker';
import type { DestinoResponseDTO } from '../../destinos/types/destino';

interface ActividadFormProps {
  destinoId?: number;
  planificacionId?: number;
  onCreated?: () => void;
  onSubmit?: (data: Omit<ActividadRequestDTO, 'planificacionId'> & { planificacionId?: number }) => Promise<void>;
  onCancel?: () => void;
  fechaInicio?: string;
  fechaFin?: string;
  destinos?: DestinoResponseDTO[];
}

export const ActividadForm = ({ destinoId: initialDestinoId, planificacionId, onCreated, onSubmit, onCancel, fechaInicio, fechaFin, destinos }: ActividadFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    hora: '',
    notas: '',
    destinoId: initialDestinoId || 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.fecha) {
      setError('Por favor complete los campos obligatorios.');
      return;
    }

    const horaFinal = formData.hora || '00:00';
    const formattedFechaHora = horaFinal.length === 5 ? `${formData.fecha}T${horaFinal}:00` : `${formData.fecha}T${horaFinal}`;

    const request = {
      ...(formData.destinoId ? { destinoId: formData.destinoId } : {}),
      ...(planificacionId ? { planificacionId } : {}),
      nombre: formData.nombre.trim(),
      fechaHora: formattedFechaHora,
      notas: formData.notas.trim(),
    };

    try {
      setSubmitting(true);
      setError(null);
      if (onSubmit) {
        await onSubmit(request);
      } else {
        await actividadService.create(request as ActividadRequestDTO);
      }
      setFormData({ nombre: '', fecha: '', hora: '', notas: '', destinoId: 0 });
      if (onCreated) onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Agregar Actividad</h3>
      {error && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {destinos && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Destino
            </label>
            <select
              value={formData.destinoId}
              onChange={(e) => setFormData({ ...formData, destinoId: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all outline-none"
            >
              <option value={0}>Sin destino específico</option>
              {destinos.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.nombre} ({dest.ciudad})
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="act-nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre de la actividad <span className="text-rose-500">*</span></label>
          <input
            id="act-nombre"
            type="text"
            placeholder="Ej: Visita guiada al museo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-colors duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Fecha <span className="text-rose-500">*</span></label>
            <PopoverDatePicker date={formData.fecha} onChange={(date) => setFormData({ ...formData, fecha: date })} minDate={fechaInicio} maxDate={fechaFin} placeholder="Seleccionar..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Hora</label>
            <TimePicker time={formData.hora} onChange={(time) => setFormData({ ...formData, hora: time })} />
          </div>
        </div>

        <div>
          <label htmlFor="act-notas" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notas</label>
          <textarea
            id="act-notas"
            placeholder="Detalles adicionales..."
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
            {submitting ? 'Agregando...' : 'Guardar Actividad'}
          </button>
        </div>
      </form>
    </div>
  );
};
