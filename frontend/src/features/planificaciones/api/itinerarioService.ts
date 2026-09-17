import { apiClient } from '../../../shared/api/client';
import type {
  DiaItinerarioRequestDTO,
  DiaItinerarioResponseDTO,
  ItemItinerarioRequestDTO,
  ItemItinerarioResponseDTO,
} from '../types/itinerario';

export const itinerarioService = {
  getDiasByPlanificacion: async (planificacionId: number): Promise<DiaItinerarioResponseDTO[]> => {
    const response = await apiClient.get<DiaItinerarioResponseDTO[]>(
      `/itinerarios/planificacion/${planificacionId}/dias`
    );
    return response.data;
  },

  createDia: async (data: DiaItinerarioRequestDTO): Promise<DiaItinerarioResponseDTO> => {
    const response = await apiClient.post<DiaItinerarioResponseDTO>('/itinerarios/dias', data);
    return response.data;
  },

  deleteDia: async (id: number): Promise<void> => {
    await apiClient.delete(`/itinerarios/dias/${id}`);
  },

  createItem: async (data: ItemItinerarioRequestDTO): Promise<ItemItinerarioResponseDTO> => {
    const response = await apiClient.post<ItemItinerarioResponseDTO>('/itinerarios/items', data);
    return response.data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/itinerarios/items/${id}`);
  },

  // Backwards compatibility helper
  getItinerario: async (planificacionId: string | number): Promise<DiaItinerarioResponseDTO[]> => {
    const id = typeof planificacionId === 'string' ? parseInt(planificacionId, 10) : planificacionId;
    return itinerarioService.getDiasByPlanificacion(id);
  },
};
