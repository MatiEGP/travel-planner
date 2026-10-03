import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { PlanificacionRequestDTO } from '../../features/planificaciones/types/planificacion';
import { useAuth } from '../../features/auth/context/useAuth';

const CalendarRangePicker = ({
  startDate,
  endDate,
  onChange
}: {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
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
        const distToStart = new Date(date).getTime() - new Date(startDate).getTime();
        const distToEnd = new Date(endDate).getTime() - new Date(date).getTime();
        
        if (distToStart <= distToEnd) {
          onChange(date, endDate);
        } else {
          onChange(startDate, date);
        }
      }
    }
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

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

  return (
    <div className="w-full bg-[#F1F3F4] rounded-xl p-4 select-none min-h-[340px] flex flex-col">
      {view === 'days' ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 transition-colors">
              &lt;
            </button>
            <button 
              type="button" 
              onClick={() => setView('months')}
              className="font-bold text-slate-700 hover:text-coral-500 transition-colors px-3 py-1 hover:bg-slate-200 rounded-lg"
            >
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </button>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 transition-colors">
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
            <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div>
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-sm flex-1">
            {blanks.map(b => <div key={`blank-${b}`} />)}
            {days.map(d => {
              const selected = isSelected(d);
              const start = isStart(d);
              const end = isEnd(d);
              const range = isInRange(d);
              
              // Apply continuous band highlighting
              let wrapperClass = "relative flex justify-center items-center h-8 w-full";
              if (range) {
                wrapperClass += " bg-coral-100";
              } else if (start && endDate && startDate !== endDate) {
                wrapperClass += " bg-gradient-to-r from-transparent from-50% to-coral-100 to-50%";
              } else if (end && startDate && startDate !== endDate) {
                wrapperClass += " bg-gradient-to-l from-transparent from-50% to-coral-100 to-50%";
              }

              return (
                <div key={d} className={wrapperClass}>
                  <button
                    type="button"
                    onClick={() => handleDayClick(d)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full z-10 transition-all ${
                      selected 
                        ? 'bg-coral-500 text-white font-bold shadow-md' 
                        : range 
                          ? 'bg-transparent text-coral-900 font-medium hover:bg-coral-200' 
                          : 'hover:bg-slate-200 text-slate-700 font-medium'
                    }`}
                  >
                    {d}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1))} className="p-1 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 transition-colors">
              &lt;
            </button>
            <span className="font-bold text-slate-700">{currentMonth.getFullYear()}</span>
            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1))} className="p-1 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-slate-500 transition-colors">
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 flex-1 items-center">
            {shortMonthNames.map((m, idx) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setCurrentMonth(new Date(currentMonth.getFullYear(), idx, 1));
                  setView('days');
                }}
                className={`py-3 rounded-lg text-sm font-semibold transition-colors ${
                  currentMonth.getMonth() === idx
                    ? 'bg-coral-500 text-white shadow-md'
                    : 'hover:bg-slate-200 text-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-auto pt-3 flex justify-between text-xs font-bold text-slate-500 border-t border-slate-200">
        <span className={startDate ? 'text-coral-500' : ''}>Inicio: {startDate || 'Seleccione...'}</span>
        <span className={endDate ? 'text-coral-500' : ''}>Fin: {endDate || 'Seleccione...'}</span>
      </div>
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

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Fechas del Viaje *
              </label>
              <CalendarRangePicker
                startDate={formData.fechaInicio}
                endDate={formData.fechaFin}
                onChange={(start, end) => setFormData({ ...formData, fechaInicio: start, fechaFin: end })}
              />
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
