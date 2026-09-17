import { apiClient } from '../../../shared/api/client';
import type { PlanificacionRequestDTO, PlanificacionResponseDTO } from '../types/planificacion';

export const planificacionService = {
  getByUsuario: async (usuarioId: number, options?: { signal?: AbortSignal }): Promise<PlanificacionResponseDTO[]> => {
    const response = await apiClient.get<PlanificacionResponseDTO[]>(`/planificaciones/usuario/${usuarioId}`, options);
    return response.data;
  },

  getById: async (id: number, options?: { signal?: AbortSignal }): Promise<PlanificacionResponseDTO> => {
    const response = await apiClient.get<PlanificacionResponseDTO>(`/planificaciones/${id}`, options);
    return response.data;
  },

  create: async (data: PlanificacionRequestDTO, options?: { signal?: AbortSignal }): Promise<PlanificacionResponseDTO> => {
    const response = await apiClient.post<PlanificacionResponseDTO>('/planificaciones', data, options);
    return response.data;
  },

  delete: async (id: number, options?: { signal?: AbortSignal }): Promise<void> => {
    await apiClient.delete(`/planificaciones/${id}`, options);
  },
};
