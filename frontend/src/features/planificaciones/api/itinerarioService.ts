import { apiClient } from '../../../shared/api/client';
import type {
  DiaItinerarioRequestDTO,
  DiaItinerarioResponseDTO,
  ItemItinerarioRequestDTO,
  ItemItinerarioResponseDTO,
} from '../types/itinerario';

export const itinerarioService = {
  getDiasByPlanificacion: async (planificacionId: number, options?: { signal?: AbortSignal }): Promise<DiaItinerarioResponseDTO[]> => {
    const response = await apiClient.get<DiaItinerarioResponseDTO[]>(
      `/itinerarios/planificacion/${planificacionId}/dias`,
      options
    );
    return response.data;
  },

  createDia: async (data: DiaItinerarioRequestDTO, options?: { signal?: AbortSignal }): Promise<DiaItinerarioResponseDTO> => {
    const response = await apiClient.post<DiaItinerarioResponseDTO>('/itinerarios/dias', data, options);
    return response.data;
  },

  deleteDia: async (id: number, options?: { signal?: AbortSignal }): Promise<void> => {
    await apiClient.delete(`/itinerarios/dias/${id}`, options);
  },

  createItem: async (data: ItemItinerarioRequestDTO, options?: { signal?: AbortSignal }): Promise<ItemItinerarioResponseDTO> => {
    const response = await apiClient.post<ItemItinerarioResponseDTO>('/itinerarios/items', data, options);
    return response.data;
  },

  deleteItem: async (id: number, options?: { signal?: AbortSignal }): Promise<void> => {
    await apiClient.delete(`/itinerarios/items/${id}`, options);
  },

  // Backwards compatibility helper
  getItinerario: async (planificacionId: string | number, options?: { signal?: AbortSignal }): Promise<DiaItinerarioResponseDTO[]> => {
    const id = typeof planificacionId === 'string' ? parseInt(planificacionId, 10) : planificacionId;
    return itinerarioService.getDiasByPlanificacion(id, options);
  },
};
