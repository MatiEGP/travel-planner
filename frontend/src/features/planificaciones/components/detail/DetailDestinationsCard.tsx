import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DestinoResponseDTO, DestinoRequestDTO } from '../../../destinos/types/destino';
import { getTripCoverImage } from '../../../../utils/tripUtils';
import { DestinoForm } from '../../../destinos/components/DestinoForm';

interface DetailDestinationsCardProps {
  planificacionId: number;
  destinos: DestinoResponseDTO[];
  onAddDestino: (data: DestinoRequestDTO) => Promise<void>;
  onDeleteDestino: (id: number) => Promise<void>;
}

export const DetailDestinationsCard: React.FC<DetailDestinationsCardProps> = ({
  planificacionId,
  destinos,
  onAddDestino,
  onDeleteDestino,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-slate-800/20 dark:to-transparent pointer-events-none" />
      
      <div className="p-6 md:p-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-[#FF5A5F] dark:text-rose-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Destinos
                <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  {destinos.length}
                </span>
              </h2>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#e0484d] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#FF5A5F]/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar</span>
          </motion.button>
        </div>

        {destinos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-dashed border-slate-200 dark:border-slate-700 text-center"
          >
            <div className="w-14 h-14 bg-white dark:bg-slate-800 text-[#FF5A5F] dark:text-rose-400 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Sin destinos registrados</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Agrega las ciudades y lugares que vas a visitar durante tu viaje.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agrega tu primer destino</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {destinos.map((destino) => {
              const destCover = getTripCoverImage(destino.nombre || destino.ciudad, destino.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={destino.id}
                  className="group bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative"
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <img
                      src={destCover}
                      alt={destino.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {destino.ciudad}, {destino.pais}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDeleteDestino(destino.id)}
                      className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shadow-sm transition-colors"
                      title="Eliminar destino"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 line-clamp-1">
                      {destino.nombre}
                    </h3>
                    {destino.notas ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {destino.notas}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500 italic mt-1">Sin notas.</p>
                    )}
                  </div>
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
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-[#FF5A5F] dark:text-rose-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nuevo Destino</h3>
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
                  <DestinoForm
                    planificacionId={planificacionId}
                    onSubmit={async (data) => {
                      await onAddDestino(data as DestinoRequestDTO);
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

