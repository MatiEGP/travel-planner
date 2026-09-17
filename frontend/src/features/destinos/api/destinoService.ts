import { apiClient } from '../../../shared/api/client';
import type { DestinoRequestDTO, DestinoResponseDTO } from '../types/destino';

export const destinoService = {
  getByPlanificacion: async (planificacionId: number, options?: { signal?: AbortSignal }): Promise<DestinoResponseDTO[]> => {
    const response = await apiClient.get<DestinoResponseDTO[]>(`/destinos/planificacion/${planificacionId}`, options);
    return response.data;
  },

  getById: async (id: number, options?: { signal?: AbortSignal }): Promise<DestinoResponseDTO> => {
    const response = await apiClient.get<DestinoResponseDTO>(`/destinos/${id}`, options);
    return response.data;
  },

  create: async (data: DestinoRequestDTO, options?: { signal?: AbortSignal }): Promise<DestinoResponseDTO> => {
    const response = await apiClient.post<DestinoResponseDTO>('/destinos', data, options);
    return response.data;
  },

  delete: async (id: number, options?: { signal?: AbortSignal }): Promise<void> => {
    await apiClient.delete(`/destinos/${id}`, options);
  },
};
