import React, { useState, type FormEvent } from 'react';
import { CreditCard, Plus, Trash2, X, AlertCircle, DollarSign, PieChart, Home, Car, Utensils, Ticket, MoreHorizontal } from 'lucide-react';
import type { CostoResponseDTO, CostoRequestDTO } from '../../types/costo';

interface GastosSectionProps {
  planificacionId: number;
  costos: CostoResponseDTO[];
  onAddCosto: (data: CostoRequestDTO) => Promise<void>;
  onDeleteCosto: (id: number) => Promise<void>;
  openModalTrigger?: number;
}

const DEFAULT_CATEGORIES = [
  { name: 'Alojamiento', icon: Home, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { name: 'Transporte', icon: Car, color: 'bg-sky-50 text-sky-700 border-sky-100' },
  { name: 'Comida', icon: Utensils, color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { name: 'Actividades', icon: Ticket, color: 'bg-rose-50 text-[#FF5A5F] border-rose-100' },
  { name: 'Otros', icon: MoreHorizontal, color: 'bg-slate-50 text-slate-700 border-slate-200' },
];

export const GastosSection: React.FC<GastosSectionProps> = ({
  planificacionId,
  costos,
  onAddCosto,
  onDeleteCosto,
  openModalTrigger,
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

  // Group by category
  const categoryTotals: Record<string, number> = {};
  costos.forEach((c) => {
    const cat = c.categoria || 'Otros';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(c.monto) || 0);
  });

  const handleOpenModal = () => {
    setFormData({
      categoria: 'Alojamiento',
      monto: '',
      descripcion: '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  React.useEffect(() => {
    if (openModalTrigger && openModalTrigger > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleOpenModal();
      document.getElementById('section-gastos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
     
  }, [openModalTrigger]);

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

  const getCategoryConfig = (catName: string) => {
    const found = DEFAULT_CATEGORIES.find(
      (c) => c.name.toLowerCase() === catName.toLowerCase()
    );
    return (
      found || {
        name: catName,
        icon: MoreHorizontal,
        color: 'bg-emerald-50 text-[#10B981] border-emerald-100',
      }
    );
  };

  return (
    <section id="section-gastos" className="mb-10 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#10B981]">
            <CreditCard className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-[#222222]">Gastos y Presupuesto</h2>
          <span className="text-xs bg-emerald-50 text-[#10B981] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            ${totalSum.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </span>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-1.5 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/50"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Gasto</span>
        </button>
      </div>

      {/* Budget Summary Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Acumulado</span>
            <div className="text-3xl font-extrabold text-[#10B981] mt-0.5">
              ${totalSum.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
            <PieChart className="w-4 h-4 text-[#10B981]" />
            <span>{costos.length} {costos.length === 1 ? 'gasto registrado' : 'gastos registrados'}</span>
          </div>
        </div>

        {/* Category Breakdown Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-5">
          {DEFAULT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const amount = categoryTotals[cat.name] || 0;
            const percent = totalSum > 0 ? ((amount / totalSum) * 100).toFixed(0) : '0';

            return (
              <div
                key={cat.name}
                className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{percent}%</span>
                </div>
                <div className="text-sm font-bold text-slate-800">
                  ${amount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense List */}
      {costos.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center">
          <div className="w-12 h-12 bg-emerald-50 text-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Sin gastos registrados</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            Lleva el control de alojamientos, pasajes, comidas y tours de tu viaje.
          </p>
          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar primer gasto</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {costos.map((costo) => {
            const config = getCategoryConfig(costo.categoria);
            const Icon = config.icon;

            return (
              <div
                key={costo.id}
                className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {costo.descripcion}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border mt-0.5 ${config.color}`}>
                      {costo.categoria}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-base font-extrabold text-[#10B981]">
                    ${Number(costo.monto).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteCosto(costo.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Eliminar gasto"
                    aria-label={`Eliminar gasto ${costo.descripcion}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#10B981]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#222222]">Registrar Gasto</h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-cost-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría *
                </label>
                <select
                  id="modal-cost-cat"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all bg-white text-slate-800"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="modal-cost-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción *
                </label>
                <input
                  id="modal-cost-desc"
                  type="text"
                  placeholder="Ej: Reserva hotel 3 noches, Billetes de tren"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="modal-cost-monto" className="block text-xs font-semibold text-slate-700 mb-1">
                  Monto ($) *
                </label>
                <input
                  id="modal-cost-monto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Ej: 150.00"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold bg-[#FF5A5F] hover:bg-[#e0484d] text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Guardar Gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
