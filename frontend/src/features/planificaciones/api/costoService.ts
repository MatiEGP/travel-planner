import { apiClient } from '../../../shared/api/client';
import type { CostoRequestDTO, CostoResponseDTO } from '../types/costo';

export const costoService = {
  getByPlanificacion: async (planificacionId: number): Promise<CostoResponseDTO[]> => {
    const response = await apiClient.get<CostoResponseDTO[]>(`/costos/planificacion/${planificacionId}`);
    return response.data;
  },

  getById: async (id: number): Promise<CostoResponseDTO> => {
    const response = await apiClient.get<CostoResponseDTO>(`/costos/${id}`);
    return response.data;
  },

  create: async (data: CostoRequestDTO): Promise<CostoResponseDTO> => {
    const response = await apiClient.post<CostoResponseDTO>('/costos', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/costos/${id}`);
  },
};
