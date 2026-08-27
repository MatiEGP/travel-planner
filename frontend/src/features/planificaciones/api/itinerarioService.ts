import type { DiaItinerarioDTO } from '../types/itinerario';

// Assuming we have some base API client. We'll use fetch as a placeholder if there isn't one.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const itinerarioService = {
  async getItinerario(planificacionId: string): Promise<DiaItinerarioDTO[]> {
    const response = await fetch(`${BASE_URL}/planificaciones/${planificacionId}/itinerario`);
    if (!response.ok) {
      throw new Error(`Failed to fetch itinerario: ${response.statusText}`);
    }
    return response.json();
  }
};
