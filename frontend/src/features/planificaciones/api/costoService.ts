import { apiClient } from '../../../shared/api/client';
import type { CostoRequestDTO, CostoResponseDTO } from '../types/costo';

export const costoService = {
  getByPlanificacion: async (planificacionId: number, options?: { signal?: AbortSignal }): Promise<CostoResponseDTO[]> => {
    const response = await apiClient.get<CostoResponseDTO[]>(`/costos/planificacion/${planificacionId}`, options);
    return response.data;
  },

  getById: async (id: number, options?: { signal?: AbortSignal }): Promise<CostoResponseDTO> => {
    const response = await apiClient.get<CostoResponseDTO>(`/costos/${id}`, options);
    return response.data;
  },

  create: async (data: CostoRequestDTO, options?: { signal?: AbortSignal }): Promise<CostoResponseDTO> => {
    const response = await apiClient.post<CostoResponseDTO>('/costos', data, options);
    return response.data;
  },

  delete: async (id: number, options?: { signal?: AbortSignal }): Promise<void> => {
    await apiClient.delete(`/costos/${id}`, options);
  },
};
