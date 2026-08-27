import React, { useEffect, useState } from 'react';
import type { DiaItinerarioDTO } from '../types/itinerario';
import { itinerarioService } from '../api/itinerarioService';
import { DiaItinerarioCard } from './DiaItinerarioCard';

interface Props {
  planificacionId: string;
}

export const ItinerarioView: React.FC<Props> = ({ planificacionId }) => {
  const [dias, setDias] = useState<DiaItinerarioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchItinerario = async () => {
      try {
        setLoading(true);
        const data = await itinerarioService.getItinerario(planificacionId);
        if (mounted) {
          setDias(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error fetching itinerario'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchItinerario();

    return () => {
      mounted = false;
    };
  }, [planificacionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    // We throw to let the ErrorBoundary catch it, as per the spec.
    throw error;
  }

  const isEmpty = dias.length === 0 || dias.every(dia => dia.items.length === 0);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <div className="text-slate-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
        <p className="text-slate-400 mb-6 text-center max-w-md">Your itinerary is empty. Start adding destinations and activities to see them here.</p>
        <button className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-lg transition-colors">
          Add your first destination
        </button>
      </div>
    );
  }

  // Aggregate total costs across all days and items
  const totalGeneral = dias.reduce((accDia, dia) => {
    return accDia + dia.items.reduce((accItem, item) => {
      return accItem + item.costos.reduce((accCosto, costo) => accCosto + costo.monto, 0);
    }, 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6 p-4 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-lg sticky top-4 z-20">
        <h2 className="text-2xl font-bold text-white">Your Itinerary</h2>
        <div className="text-right">
          <span className="text-sm text-slate-400 block">Total Estimated Cost</span>
          <span className="text-2xl font-bold text-teal-400">${totalGeneral.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-6">
        {dias.map(dia => (
          <DiaItinerarioCard key={dia.id} dia={dia} />
        ))}
      </div>
    </div>
  );
};
