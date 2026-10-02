import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { PlanificacionRequestDTO } from '../../planificaciones/types/planificacion';
import { useAuth } from '../../auth/context/useAuth';

// --- Calendar State Machine ---
const CalendarRangePicker = ({
  startDate,
  endDate,
  onChange
}: {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    startDate ? new Date(`${startDate}T12:00:00`) : new Date()
  );
  const [view, setView] = useState<'days' | 'months'>('days');

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDayClick = (day: number) => {
    const date = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (!startDate && !endDate) {
      onChange(date, '');
    } else if (startDate && !endDate) {
      if (date === startDate) {
        onChange('', '');
      } else if (date < startDate) {
        onChange(date, '');
      } else {
        onChange(startDate, date);
      }
    } else if (!startDate && endDate) {
      if (date === endDate) {
        onChange('', '');
      } else if (date < endDate) {
        onChange(date, endDate);
      } else {
        onChange(endDate, date);
      }
    } else if (startDate && endDate) {
      if (date === startDate) {
        onChange('', endDate);
      } else if (date === endDate) {
        onChange(startDate, '');
      } else if (date < startDate) {
        onChange(date, endDate);
      } else if (date > endDate) {
        onChange(startDate, date);
      } else {
        const distToStart = new Date(`${date}T12:00:00`).getTime() - new Date(`${startDate}T12:00:00`).getTime();
        const distToEnd = new Date(`${endDate}T12:00:00`).getTime() - new Date(`${date}T12:00:00`).getTime();
        
        if (distToStart <= distToEnd) {
          onChange(date, endDate);
        } else {
          onChange(startDate, date);
        }
      }
    }
  };

  const isSelected = (d: number) => {
    const ds = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return ds === startDate || ds === endDate;
  };
  const isStart = (d: number) => {
    const ds = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return ds === startDate;
  };
  const isEnd = (d: number) => {
    const ds = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return ds === endDate;
  };
  const isInRange = (d: number) => {
    if (!startDate || !endDate) return false;
    const ds = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return ds > startDate && ds < endDate;
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const shortMonthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  return (
    <div className="w-full bg-[#F1F3F4] dark:bg-slate-800 rounded-2xl p-4 select-none flex flex-col transition-colors duration-300">
      <AnimatePresence mode="wait">
        {view === 'days' ? (
          <motion.div
            key="days"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 transition-colors">
                &lt;
              </button>
              <button 
                type="button" 
                onClick={() => setView('months')}
                className="font-semibold text-slate-700 dark:text-slate-200 hover:text-coral-500 dark:hover:text-coral-400 transition-colors px-3 py-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg"
              >
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </button>
              <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 transition-colors">
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">
              <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center text-sm flex-1">
              {blanks.map(b => <div key={`blank-${b}`} />)}
              {days.map(d => {
                const selected = isSelected(d);
                const start = isStart(d);
                const end = isEnd(d);
                const range = isInRange(d);
                
                let wrapperClass = "relative flex justify-center items-center h-9 w-full";
                if (range) {
                  wrapperClass += " bg-coral-50 dark:bg-coral-500/10";
                } else if (start && endDate && startDate !== endDate) {
                  wrapperClass += " bg-gradient-to-r from-transparent from-50% to-coral-50 dark:to-coral-500/10 to-50%";
                } else if (end && startDate && startDate !== endDate) {
                  wrapperClass += " bg-gradient-to-l from-transparent from-50% to-coral-50 dark:to-coral-500/10 to-50%";
                }

                return (
                  <div key={d} className={wrapperClass}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => handleDayClick(d)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full z-10 transition-colors duration-200 ${
                        selected 
                          ? 'bg-coral-500 text-white font-bold' 
                          : range 
                            ? 'bg-transparent text-coral-900 dark:text-coral-200 font-medium hover:bg-coral-100 dark:hover:bg-coral-500/20' 
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium'
                      }`}
                    >
                      {d}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="months"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-[260px]"
          >
            <div className="flex justify-between items-center mb-4">
              <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1))} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 transition-colors">
                &lt;
              </button>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{currentMonth.getFullYear()}</span>
              <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1))} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 transition-colors">
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 flex-1 items-center">
              {shortMonthNames.map((m, idx) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setCurrentMonth(new Date(currentMonth.getFullYear(), idx, 1));
                    setView('days');
                  }}
                  className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                    currentMonth.getMonth() === idx
                      ? 'bg-coral-500 text-white'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
  });

  // Reset form when modal closes
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (!isOpen && prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    setFormData({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '' });
    setError(null);
  } else if (isOpen && prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) {
      setError('Debes iniciar sesión para crear una planificación.');
      return;
    }

    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.fechaInicio || !formData.fechaFin) {
      setError('Por favor completá todos los campos y seleccioná las fechas en el calendario.');
      return;
    }

    if (formData.fechaInicio > formData.fechaFin) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        usuarioId: usuario.id,
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la planificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Subtle backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !loading && onClose()}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Clean ease-out
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Crear Planificación
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none disabled:opacity-50"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Título del Viaje
                  </label>
                  <input
                    id="titulo"
                    type="text"
                    required
                    placeholder="Ej: Escapada a la Patagonia"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F1F3F4] dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-coral-500 outline-none transition-shadow font-medium placeholder-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    rows={2}
                    required
                    placeholder="Un viaje para desconectar y conocer los glaciares..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F1F3F4] dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-coral-500 outline-none transition-shadow font-medium placeholder-slate-400 resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Fechas
                    </label>
                    <span className="text-xs font-medium text-slate-400">
                      {formData.fechaInicio && formData.fechaFin 
                        ? `${new Date(`${formData.fechaInicio}T12:00:00`).toLocaleDateString('es-AR', {day: '2-digit', month: 'short'})} - ${new Date(`${formData.fechaFin}T12:00:00`).toLocaleDateString('es-AR', {day: '2-digit', month: 'short'})}`
                        : 'Seleccionar en el calendario'}
                    </span>
                  </div>
                  <CalendarRangePicker
                    startDate={formData.fechaInicio}
                    endDate={formData.fechaFin}
                    onChange={(start, end) => setFormData({ ...formData, fechaInicio: start, fechaFin: end })}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-coral-500 hover:bg-coral-600 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        Creando...
                      </>
                    ) : (
                      'Crear'
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
