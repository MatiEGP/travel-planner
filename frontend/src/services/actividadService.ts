import { apiClient } from '../api/client';
import type { ActividadRequestDTO, ActividadResponseDTO } from '../types/actividad';

export const actividadService = {
  getByDestino: async (destinoId: number): Promise<ActividadResponseDTO[]> => {
    const response = await apiClient.get<ActividadResponseDTO[]>(`/actividades/destino/${destinoId}`);
    return response.data;
  },

  getById: async (id: number): Promise<ActividadResponseDTO> => {
    const response = await apiClient.get<ActividadResponseDTO>(`/actividades/${id}`);
    return response.data;
  },

  create: async (data: ActividadRequestDTO): Promise<ActividadResponseDTO> => {
    const response = await apiClient.post<ActividadResponseDTO>('/actividades', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/actividades/${id}`);
  },
};
