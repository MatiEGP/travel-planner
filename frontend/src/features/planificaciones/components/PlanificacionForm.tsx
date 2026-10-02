import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { planificacionService } from '../api/planificacionService';
import type { PlanificacionRequestDTO } from '../types/planificacion';
import { useAuth } from '../../auth/context/useAuth';
import { PopoverDatePicker } from '../../../components/ui/PopoverDatePicker';

const schema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().min(1, 'La fecha de fin es requerida'),
}).refine((data) => new Date(data.fechaInicio) <= new Date(data.fechaFin), {
  message: "La fecha de fin debe ser posterior a la de inicio",
  path: ["fechaFin"],
});

type PlanificacionFormData = z.infer<typeof schema>;

interface PlanificacionFormProps {
  onCreated: () => void;
}

export const PlanificacionForm = ({ onCreated }: PlanificacionFormProps) => {
  const { usuario } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanificacionFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: PlanificacionFormData) => {
    if (!usuario) return;

    const request: PlanificacionRequestDTO = {
      usuarioId: usuario.id,
      ...data,
    };

    try {
      setSubmitting(true);
      setError(null);
      await planificacionService.create(request);
      reset();
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-slate-900/50 p-6 border border-slate-200 dark:border-slate-700/50 transition-all">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Crear Nueva Planificación</h3>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="mb-6 p-4 bg-rose-50/50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/50 rounded-xl text-rose-600 dark:text-rose-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="titulo" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Título del viaje
          </label>
          <input
            id="titulo"
            type="text"
            placeholder="Ej: Vacaciones en Europa"
            {...register('titulo')}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all duration-200 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400"
          />
          <AnimatePresence>
            {errors.titulo && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-rose-500 mt-1.5"
              >
                {errors.titulo.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Descripción
          </label>
          <textarea
            id="descripcion"
            placeholder="Describí tu viaje..."
            rows={3}
            {...register('descripcion')}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all duration-200 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 resize-none"
          />
          <AnimatePresence>
            {errors.descripcion && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-rose-500 mt-1.5"
              >
                {errors.descripcion.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Fecha de inicio
            </label>
            <Controller
              name="fechaInicio"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <PopoverDatePicker
                    id="fechaInicio"
                    date={field.value}
                    onChange={field.onChange}
                    placeholder="Seleccionar inicio"
                  />
                </div>
              )}
            />
            <AnimatePresence>
              {errors.fechaInicio && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-rose-500 mt-1.5"
                >
                  {errors.fechaInicio.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label htmlFor="fechaFin" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Fecha de fin
            </label>
            <Controller
              name="fechaFin"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <PopoverDatePicker
                    id="fechaFin"
                    date={field.value}
                    onChange={field.onChange}
                    placeholder="Seleccionar fin"
                  />
                </div>
              )}
            />
            <AnimatePresence>
              {errors.fechaFin && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-rose-500 mt-1.5"
                >
                  {errors.fechaFin.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-coral-500/30"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando...
              </span>
            ) : (
              'Crear Planificación'
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

