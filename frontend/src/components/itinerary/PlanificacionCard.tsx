import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, Plane, CheckCircle2, Trash2, MapPin } from 'lucide-react';
import type { PlanificacionResponseDTO } from '../../features/planificaciones/types/planificacion';
import type { DestinoResponseDTO } from '../../features/destinos/types/destino';
import type { ActividadResponseDTO } from '../../features/actividades/types/actividad';
import { getTripStatus, formatDateRange, getTripCoverImage } from '../../utils/tripUtils';

export type DestinoWithActividades = DestinoResponseDTO & {
  actividades?: ActividadResponseDTO[];
};

export interface PlanificacionCardProps {
  planificacion: PlanificacionResponseDTO;
  destinos?: DestinoWithActividades[];
  onDelete?: (id: number) => void;
}

export const PlanificacionCard: React.FC<PlanificacionCardProps> = ({
  planificacion,
  destinos = [],
  onDelete,
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const status = getTripStatus(planificacion.fechaInicio, planificacion.fechaFin);
  const formattedDates = formatDateRange(planificacion.fechaInicio, planificacion.fechaFin);
  const coverImage = getTripCoverImage(planificacion.titulo, planificacion.id);

  const handleCardClick = () => {
    navigate(`/planificaciones/${planificacion.id}/destinos`);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(planificacion.id);
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case 'UPCOMING':
        return (
          <span className="bg-white/85 backdrop-blur-md text-slate-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Próximo</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="bg-white/85 backdrop-blur-md text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Plane className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>En curso</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-white/85 backdrop-blur-md text-slate-600 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Finalizado</span>
          </span>
        );
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer border border-transparent hover:border-slate-100 relative"
      aria-label={`Planificación: ${planificacion.titulo}`}
    >
      {/* 16:9 Cover Image Container */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={planificacion.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top-Left Glassmorphism Status Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          {renderStatusBadge()}
        </div>

        {/* Top-Right Action Buttons */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white text-slate-400 hover:text-rose-600 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
              title="Borrar Plan"
              aria-label="Borrar Plan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleHeartClick}
            className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-400 ${
              isFavorite ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
            }`}
            title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 stroke-rose-500' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-slate-900 font-bold text-xl mb-1 line-clamp-1 group-hover:text-[#FF5A5F] transition-colors">
          {planificacion.titulo}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
          {planificacion.descripcion || 'Sin descripción disponible.'}
        </p>

        {/* Destinos Tags */}
        <div className="mb-4">
          {destinos.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {destinos.map((dest) => (
                <span
                  key={dest.id}
                  className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-[#FF5A5F]" />
                  <span>
                    {dest.nombre ? dest.nombre : `${dest.ciudad}, ${dest.pais}`}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Aún no agregaste destinos a este viaje.
            </p>
          )}
        </div>

        {/* Dates Footer */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDates}</span>
          </div>
          <span className="text-[#FF5A5F] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Ver itinerario &rarr;
          </span>
        </div>
      </div>
    </article>
  );
};
