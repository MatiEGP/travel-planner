import { apiClient } from '../../../shared/api/client';
import type { ActividadRequestDTO, ActividadResponseDTO } from '../types/actividad';

export const actividadService = {
  getByDestino: async (destinoId: number, options?: { signal?: AbortSignal }): Promise<ActividadResponseDTO[]> => {
    const response = await apiClient.get<ActividadResponseDTO[]>(`/actividades/destino/${destinoId}`, options);
    return response.data;
  },

  getByPlanificacion: async (planificacionId: number, options?: { signal?: AbortSignal }): Promise<ActividadResponseDTO[]> => {
    const response = await apiClient.get<ActividadResponseDTO[]>(`/actividades/planificacion/${planificacionId}`, options);
    return response.data;
  },

  getById: async (id: number, options?: { signal?: AbortSignal }): Promise<ActividadResponseDTO> => {
    const response = await apiClient.get<ActividadResponseDTO>(`/actividades/${id}`, options);
    return response.data;
  },

  create: async (data: ActividadRequestDTO, options?: { signal?: AbortSignal }): Promise<ActividadResponseDTO> => {
    const response = await apiClient.post<ActividadResponseDTO>('/actividades', data, options);
    return response.data;
  },

  delete: async (id: number, options?: { signal?: AbortSignal }): Promise<void> => {
    await apiClient.delete(`/actividades/${id}`, options);
  },
};
