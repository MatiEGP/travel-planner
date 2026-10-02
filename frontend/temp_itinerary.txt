import React, { useState, useMemo, type FormEvent } from 'react';
import { CalendarDays, Plus, Trash2, X, AlertCircle, Clock, Sparkles, MapPin, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  DiaItinerarioResponseDTO,
  DiaItinerarioRequestDTO,
  ItemItinerarioRequestDTO,
  ItemItinerarioResponseDTO,
} from '../../types/itinerario';
import type { ActividadResponseDTO } from '../../../actividades/types/actividad';
import type { DestinoResponseDTO } from '../../../destinos/types/destino';
import { PopoverDatePicker } from '../../../../components/ui/PopoverDatePicker';
import { TimePicker } from '../../../../components/ui/TimePicker';

interface DetailItineraryCardProps {
  planificacionId: number;
  fechaInicio: string;
  fechaFin: string;
  dias: DiaItinerarioResponseDTO[];
  actividades: ActividadResponseDTO[];
  destinos?: DestinoResponseDTO[];
  onAddDia: (data: DiaItinerarioRequestDTO) => Promise<void>;
  onDeleteDia: (id: number) => Promise<void>;
  onAddItem: (data: ItemItinerarioRequestDTO) => Promise<void>;
  onDeleteItem: (id: number) => Promise<void>;
}

export const DetailItineraryCard: React.FC<DetailItineraryCardProps> = ({
  planificacionId,
  fechaInicio,
  fechaFin,
  dias,
  actividades = [],
  destinos = [],
  onAddDia,
  onDeleteDia,
  onAddItem,
  onDeleteItem,
}) => {
  const sortedDias = useMemo(() => {
    return [...dias].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [dias]);

  const [selectedDiaId, setSelectedDiaId] = useState<number | null>(null);

  const activeDia = useMemo(() => {
    if (sortedDias.length === 0) return null;
    if (selectedDiaId) {
      const found = sortedDias.find((d) => d.id === selectedDiaId);
      if (found) return found;
    }
    return sortedDias[0];
  }, [sortedDias, selectedDiaId]);

  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [newDayFecha, setNewDayFecha] = useState('');
  const [itemFormData, setItemFormData] = useState<{
    tipo: 'ACTIVIDAD' | 'DESTINO';
    referenciaId: string;
    horaInicio: string;
    horaFin: string;
    notas: string;
  }>({
    tipo: 'ACTIVIDAD',
    referenciaId: '',
    horaInicio: '',
    horaFin: '',
    notas: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenDayModal = () => {
    setNewDayFecha('');
    setError(null);
    setIsDayModalOpen(true);
  };

  const handleOpenItemModal = () => {
    const defaultTipo = 'ACTIVIDAD';
    const defaultRefId = actividades.length > 0 ? String(actividades[0].id) : '';
    setItemFormData({
      tipo: defaultTipo,
      referenciaId: defaultRefId,
      horaInicio: '',
      horaFin: '',
      notas: '',
    });
    setError(null);
    setIsItemModalOpen(true);
  };

  const handleTipoChange = (newTipo: 'ACTIVIDAD' | 'DESTINO') => {
    let defaultRefId = '';
    if (newTipo === 'ACTIVIDAD' && actividades.length > 0) {
      defaultRefId = String(actividades[0].id);
    } else if (newTipo === 'DESTINO' && destinos && destinos.length > 0) {
      defaultRefId = String(destinos[0].id);
    }
    setItemFormData((prev) => ({
      ...prev,
      tipo: newTipo,
      referenciaId: defaultRefId,
    }));
  };

  const handleAddDaySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDayFecha) {
      setError('Por favor seleccione una fecha.');
      return;
    }

    const dateExists = dias.some((dia) => dia.fecha.split('T')[0] === newDayFecha);
    if (dateExists) {
      setError('Este día ya fue agregado al itinerario.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAddDia({
        planificacionId,
        fecha: newDayFecha,
      });
      setIsDayModalOpen(false);
    } catch (err) {
      setError((err as Error).message || 'Error al agregar día');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddItemSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeDia) return;
    if (!itemFormData.referenciaId) {
      setError(
        itemFormData.tipo === 'ACTIVIDAD'
          ? 'Por favor seleccione una actividad.'
          : 'Por favor seleccione un destino.'
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAddItem({
        diaItinerarioId: activeDia.id,
        tipo: itemFormData.tipo,
        referenciaId: Number(itemFormData.referenciaId),
        horaInicio: itemFormData.horaInicio || undefined,
        horaFin: itemFormData.horaFin || undefined,
        notas: itemFormData.notas.trim() || undefined,
      });
      setIsItemModalOpen(false);
    } catch (err) {
      setError((err as Error).message || 'Error al agregar item al itinerario');
    } finally {
      setSubmitting(false);
    }
  };

  const getItemDetails = (item: ItemItinerarioResponseDTO) => {
    if (item.tipo === 'ACTIVIDAD' || !item.tipo) {
      const act = actividades.find((a) => a.id === item.referenciaId);
      return {
        nombre: act ? act.nombre : item.notas || 'Actividad',
        tipoLabel: 'Actividad',
        badgeClass: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
        icon: Sparkles,
        iconColor: 'text-amber-500 dark:text-amber-400',
        subtext: act?.notas && act.notas !== item.notas ? act.notas : undefined,
      };
    }
    if (item.tipo === 'DESTINO') {
      const dest = destinos?.find((d) => d.id === item.referenciaId);
      return {
        nombre: dest ? `${dest.nombre} (${dest.ciudad})` : item.notas || 'Destino',
        tipoLabel: 'Destino',
        badgeClass: 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
        icon: MapPin,
        iconColor: 'text-rose-500 dark:text-rose-400',
        subtext: dest?.pais ? `País: ${dest.pais}` : undefined,
      };
    }
    return {
      nombre: item.notas || 'Item',
      tipoLabel: 'Otro',
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      icon: ChevronRight,
      iconColor: 'text-slate-500 dark:text-slate-400',
      subtext: undefined,
    };
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-slate-800/20 dark:to-transparent pointer-events-none" />
      
      <div className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Itinerario
                <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  {dias.length}
                </span>
              </h2>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenDayModal}
            className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#FF5A5F]/20 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar Día</span>
          </motion.button>
        </div>

        {dias.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-dashed border-slate-200 dark:border-slate-700 text-center"
          >
            <div className="w-14 h-14 bg-white dark:bg-slate-800 text-[#FF5A5F] dark:text-rose-400 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Diseña tu día a día</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Agrega los días de tu viaje para organizar actividades, horarios y desplazamientos.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenDayModal}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agrega tu primer día</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Days Sidebar */}
            <div className="lg:w-1/3 flex flex-col gap-2">
              {sortedDias.map((dia, index) => {
                const isSelected = activeDia?.id === dia.id;
                const diaDate = new Date(dia.fecha);
                diaDate.setMinutes(diaDate.getMinutes() + diaDate.getTimezoneOffset());
                const dayName = diaDate.toLocaleDateString('es-AR', { weekday: 'long' });
                const dateNum = diaDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={dia.id}
                    onClick={() => setSelectedDiaId(dia.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                      isSelected 
                        ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-500/30 shadow-md ring-1 ring-indigo-100 dark:ring-indigo-500/20' 
                        : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <h4 className={`font-bold capitalize ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        Día {index + 1}
                      </h4>
                      <p className={`text-sm mt-0.5 ${isSelected ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}>
                        <span className="capitalize">{dayName}</span>, {dateNum}
                      </p>
                    </div>
                    {isSelected && <ChevronRight className="w-5 h-5 text-indigo-400 dark:text-indigo-500" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Right: Active Day Details */}
            <div className="lg:w-2/3 bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50">
              {activeDia && (
                <motion.div
                  key={activeDia.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {new Date(activeDia.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {activeDia.items?.length || 0} items planeados
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDeleteDia(activeDia.id)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                        title="Eliminar día"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenItemModal}
                        className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 rounded-xl transition-colors"
                        title="Agregar item al itinerario"
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {!activeDia.items || activeDia.items.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <CalendarIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <h4 className="text-slate-700 dark:text-slate-300 font-medium mb-2">Tu día está libre</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                        Agrega destinos por visitar o actividades que ya hayas registrado.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenItemModal}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar al itinerario</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 pl-6 space-y-8 py-4">
                      {activeDia.items
                        .slice()
                        .sort((a, b) => {
                          if (!a.horaInicio) return 1;
                          if (!b.horaInicio) return -1;
                          return a.horaInicio.localeCompare(b.horaInicio);
                        })
                        .map((item) => {
                          const { nombre, tipoLabel, badgeClass, icon: ItemIcon, subtext } = getItemDetails(item);
                          return (
                            <motion.div
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={item.id}
                              className="relative group"
                            >
                              <div className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 ${item.tipo === 'DESTINO' ? 'border-rose-400' : 'border-amber-400'} flex items-center justify-center`}>
                                <div className={`w-2 h-2 rounded-full ${item.tipo === 'DESTINO' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                              </div>
                              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass} flex items-center gap-1`}>
                                        <ItemIcon className="w-3 h-3" />
                                        {tipoLabel}
                                      </span>
                                      {(item.horaInicio || item.horaFin) && (
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {item.horaInicio ? item.horaInicio.substring(0, 5) : '?'}
                                          {item.horaFin && ` - ${item.horaFin.substring(0, 5)}`}
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                                      {nombre}
                                    </h4>
                                    {(item.notas || subtext) && (
                                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                        {item.notas || subtext}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => onDeleteItem(item.id)}
                                    className="p-2 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsDayModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-indigo-500" />
                  Agregar Día
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDayModalOpen(false)}
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

              <form onSubmit={handleAddDaySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Fecha del itinerario
                  </label>
                  <PopoverDatePicker
                    date={newDayFecha ? new Date(`${newDayFecha}T00:00:00`) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        setNewDayFecha(`${year}-${month}-${day}`);
                      } else {
                        setNewDayFecha('');
                      }
                    }}
                    minDate={new Date(`${fechaInicio}T00:00:00`)}
                    maxDate={new Date(`${fechaFin}T00:00:00`)}
                    placeholder="Seleccionar..."
                    className="w-full"
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
                      'Guardar día'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsItemModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Agregar al Itinerario</h3>
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
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

              <form onSubmit={handleAddItemSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipo de item <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={itemFormData.tipo}
                    onChange={(e) => handleTipoChange(e.target.value as 'ACTIVIDAD' | 'DESTINO')}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all outline-none"
                  >
                    <option value="ACTIVIDAD">Actividad</option>
                    <option value="DESTINO">Destino</option>
                  </select>
                </div>

                {itemFormData.tipo === 'ACTIVIDAD' ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Seleccionar Actividad <span className="text-rose-500">*</span>
                    </label>
                    {actividades.length === 0 ? (
                      <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>No hay actividades registradas en este viaje.</span>
                      </div>
                    ) : (
                      <select
                        value={itemFormData.referenciaId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const act = actividades.find(a => String(a.id) === selectedId);
                          setItemFormData({ 
                            ...itemFormData, 
                            referenciaId: selectedId,
                            horaInicio: act?.fechaHora ? act.fechaHora.split('T')[1].substring(0, 5) : itemFormData.horaInicio
                          });
                        }}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all outline-none"
                      >
                        <option value="">-- Seleccionar actividad --</option>
                        {actividades.map((act) => (
                          <option key={act.id} value={act.id}>{act.nombre}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Seleccionar Destino <span className="text-rose-500">*</span>
                    </label>
                    {!destinos || destinos.length === 0 ? (
                      <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>No hay destinos registrados en este viaje.</span>
                      </div>
                    ) : (
                      <select
                        value={itemFormData.referenciaId}
                        onChange={(e) => setItemFormData({ ...itemFormData, referenciaId: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all outline-none"
                      >
                        <option value="">-- Seleccionar destino --</option>
                        {destinos.map((dest) => (
                          <option key={dest.id} value={dest.id}>
                            {dest.nombre} ({dest.ciudad})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Hora Inicio
                    </label>
                    <TimePicker time={itemFormData.horaInicio} onChange={(t) => setItemFormData({ ...itemFormData, horaInicio: t })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Hora Fin
                    </label>
                    <TimePicker time={itemFormData.horaFin} onChange={(t) => setItemFormData({ ...itemFormData, horaFin: t })} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Notas adicionales
                  </label>
                  <textarea
                    value={itemFormData.notas}
                    onChange={(e) => setItemFormData({ ...itemFormData, notas: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all outline-none min-h-[100px] resize-y"
                    placeholder="Punto de encuentro..."
                  />
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={
                      submitting ||
                      (itemFormData.tipo === 'ACTIVIDAD' && actividades.length === 0) ||
                      (itemFormData.tipo === 'DESTINO' && (!destinos || destinos.length === 0))
                    }
                    className="w-full bg-[#FF5A5F] hover:bg-[#e0484d] text-white font-bold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Guardar en itinerario'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


