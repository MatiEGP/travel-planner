import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Plus, Trash2, X, Clock, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ActividadResponseDTO, ActividadRequestDTO } from '../../../actividades/types/actividad';
import type { DestinoResponseDTO } from '../../../destinos/types/destino';
import { ActividadForm } from '../../../actividades/components/ActividadForm';

interface DetailActivitiesCardProps {
  planificacionId: number;
  fechaInicio: string;
  fechaFin: string;
  destinos: DestinoResponseDTO[];
  actividades: ActividadResponseDTO[];
  onAddActividad: (data: ActividadRequestDTO) => Promise<void>;
  onDeleteActividad: (id: number) => Promise<void>;
}

export const DetailActivitiesCard: React.FC<DetailActivitiesCardProps> = ({
  planificacionId,
  fechaInicio,
  fechaFin,
  destinos,
  actividades,
  onAddActividad,
  onDeleteActividad,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestinoId, setSelectedDestinoId] = useState<number | undefined>(undefined);

  const handleOpenModal = (defaultDestinoId?: number) => {
    setSelectedDestinoId(defaultDestinoId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDestinoId(undefined);
  };

  const formatActivityDateTime = (isoString: string) => {
    if (!isoString) return { date: '', time: '' };
    try {
      const dateObj = new Date(isoString);
      if (isNaN(dateObj.getTime())) return { date: isoString, time: '' };
      const date = dateObj.toLocaleDateString('es-AR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });
      const time = dateObj.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return { date, time };
    } catch {
      return { date: isoString, time: '' };
    }
  };

  const groupedActivities = destinos.map((dest) => ({
    destino: dest,
    items: actividades.filter((act) => act.destinoId === dest.id),
  }));

  const unassigned = actividades.filter(
    (act) => !act.destinoId || !destinos.some((d) => d.id === act.destinoId)
  );

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-slate-800/20 dark:to-transparent pointer-events-none" />
      
      <div className="p-6 md:p-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Actividades
                <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  {actividades.length}
                </span>
              </h2>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#FF5A5F]/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar</span>
          </motion.button>
        </div>

        {actividades.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-dashed border-slate-200 dark:border-slate-700 text-center"
          >
            <div className="w-14 h-14 bg-white dark:bg-slate-800 text-[#FF5A5F] dark:text-rose-400 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Sin actividades planeadas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Organiza tus visitas a monumentos, museos, tours y reservas organizadas por destino.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agrega tu primera actividad</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {groupedActivities.map(({ destino, items }) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={destino.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF5A5F] dark:text-rose-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{destino.nombre}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      ({destino.ciudad}, {destino.pais})
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenModal(destino.id)}
                    className="text-xs font-semibold text-[#FF5A5F] dark:text-rose-400 hover:text-[#e0484d] dark:hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </motion.button>
                </div>

                {items.length === 0 ? (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic py-2">
                    No hay actividades registradas para este destino.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((act) => {
                      const { date, time } = formatActivityDateTime(act.fechaHora);
                      return (
                        <div
                          key={act.id}
                          className="group relative flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{act.nombre}</h4>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {date}
                              </span>
                              {time && time !== '00:00' && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {time}
                                </span>
                              )}
                            </div>
                            {act.notas && (
                              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{act.notas}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => onDeleteActividad(act.id)}
                            className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}

            {unassigned.length > 0 && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Otras actividades</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unassigned.map((act) => {
                    const { date, time } = formatActivityDateTime(act.fechaHora);
                    return (
                      <div
                        key={act.id}
                        className="group relative flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{act.nombre}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {date}
                            </span>
                            {time && time !== '00:00' && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {time}
                              </span>
                            )}
                          </div>
                          {act.notas && (
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{act.notas}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteActividad(act.id)}
                          className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
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
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nueva Actividad</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>


                <div className="pt-2">
                  <ActividadForm
                    planificacionId={planificacionId}
                    destinoId={selectedDestinoId}
                    destinos={destinos}
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    onSubmit={async (data) => {
                      await onAddActividad(data as ActividadRequestDTO);
                    }}
                    onCreated={handleCloseModal}
                    onCancel={handleCloseModal}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};


