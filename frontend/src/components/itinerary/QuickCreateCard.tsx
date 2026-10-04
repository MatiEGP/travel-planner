import React from 'react';
import { Plus } from 'lucide-react';

interface QuickCreateCardProps {
  onClick: () => void;
}

export const QuickCreateCard: React.FC<QuickCreateCardProps> = ({ onClick }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label="Crear nueva planificación"
      className="group min-h-[380px] h-full flex flex-col items-center justify-center p-8 bg-white/60 hover:bg-rose-50/30 border-2 border-dashed border-gray-300 hover:border-[#FF5A5F] rounded-2xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:ring-offset-2"
    >
      <div className="w-16 h-16 rounded-full bg-rose-50 text-[#FF5A5F] group-hover:bg-[#FF5A5F] group-hover:text-white flex items-center justify-center mb-4 transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-rose-500/25">
        <Plus className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" />
      </div>
      <span className="text-slate-700 font-bold text-lg text-center group-hover:text-[#FF5A5F] transition-colors">
        Crear nueva planificación
      </span>
      <p className="text-slate-400 text-xs text-center mt-1 max-w-[200px]">
        Organizá tus destinos, fechas y actividades
      </p>
    </div>
  );
};
