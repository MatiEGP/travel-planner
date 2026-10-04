import React, { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, Plus, Trash2, X, AlertCircle, Home, Car, Utensils, Ticket, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CostoResponseDTO, CostoRequestDTO } from '../../types/costo';

interface DetailExpensesCardProps {
  planificacionId: number;
  costos: CostoResponseDTO[];
  onAddCosto: (data: CostoRequestDTO) => Promise<void>;
  onDeleteCosto: (id: number) => Promise<void>;
}

const DEFAULT_CATEGORIES = [
  { name: 'Alojamiento', icon: Home, color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  { name: 'Transporte', icon: Car, color: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  { name: 'Comida', icon: Utensils, color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { name: 'Actividades', icon: Ticket, color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  { name: 'Otros', icon: MoreHorizontal, color: 'bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400' },
];

export const DetailExpensesCard: React.FC<DetailExpensesCardProps> = ({
  planificacionId,
  costos,
  onAddCosto,
  onDeleteCosto,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoria: 'Alojamiento',
    monto: '',
    descripcion: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSum = costos.reduce((acc, c) => acc + (Number(c.monto) || 0), 0);

  const handleOpenModal = () => {
    setFormData({ categoria: 'Alojamiento', monto: '', descripcion: '' });
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const montoNum = parseFloat(formData.monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setError('Por favor ingrese un monto válido mayor a 0.');
      return;
    }
    if (!formData.descripcion.trim()) {
      setError('Por favor ingrese una descripción.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAddCosto({
        planificacionId,
        categoria: formData.categoria,
        monto: montoNum,
        descripcion: formData.descripcion.trim(),
      });
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message || 'Error al registrar el gasto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-slate-800/20 dark:to-transparent pointer-events-none" />
      
      <div className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Gastos
                <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  {costos.length}
                </span>
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {costos.length > 0 && (
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium mr-2">Total:</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  ${totalSum.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#FF5A5F]/20 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar</span>
            </motion.button>
          </div>
        </div>

        {costos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-dashed border-slate-200 dark:border-slate-700 text-center"
          >
            <div className="w-14 h-14 bg-white dark:bg-slate-800 text-[#FF5A5F] dark:text-rose-400 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Lleva el control de tus gastos</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Agrega tu primer gasto para mantener tu presupuesto organizado durante el viaje.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agrega tu primer gasto</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {costos.map((costo) => {
              const rawCat = (costo.categoria || 'Otros').trim().toLowerCase();
              const catDef = DEFAULT_CATEGORIES.find(c => c.name.toLowerCase() === rawCat) || DEFAULT_CATEGORIES[4];
              const Icon = catDef.icon;
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={costo.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex items-start gap-4 relative"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${catDef.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {costo.descripcion}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {catDef.name}
                    </p>
                    <p className="text-base font-bold text-slate-900 dark:text-white mt-2">
                      ${Number(costo.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  <button
                    title="Eliminar gasto"
                      type="button"
                    onClick={() => onDeleteCosto(costo.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                onClick={handleCloseModal}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nuevo Gasto</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Monto (ARS) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.monto}
                      onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Categoría <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all outline-none"
                    >
                      {DEFAULT_CATEGORIES.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Descripción <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all outline-none"
                      placeholder="Ej. Cena en restaurante"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#FF5A5F] hover:bg-[#e0484d] text-white font-bold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Registrar gasto'
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

