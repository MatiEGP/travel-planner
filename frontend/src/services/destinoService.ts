import { apiClient } from '../api/client';
import type { DestinoRequestDTO, DestinoResponseDTO } from '../types/destino';

export const destinoService = {
  getByPlanificacion: async (planificacionId: number): Promise<DestinoResponseDTO[]> => {
    const response = await apiClient.get<DestinoResponseDTO[]>(`/destinos/planificacion/${planificacionId}`);
    return response.data;
  },

  getById: async (id: number): Promise<DestinoResponseDTO> => {
    const response = await apiClient.get<DestinoResponseDTO>(`/destinos/${id}`);
    return response.data;
  },

  create: async (data: DestinoRequestDTO): Promise<DestinoResponseDTO> => {
    const response = await apiClient.post<DestinoResponseDTO>('/destinos', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/destinos/${id}`);
  },
};
