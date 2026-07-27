import { apiClient } from '../api/client';
import type { PlanificacionRequestDTO, PlanificacionResponseDTO } from '../types/planificacion';

export const planificacionService = {
  getByUsuario: async (usuarioId: number): Promise<PlanificacionResponseDTO[]> => {
    const response = await apiClient.get<PlanificacionResponseDTO[]>(`/planificaciones/usuario/${usuarioId}`);
    return response.data;
  },

  getById: async (id: number): Promise<PlanificacionResponseDTO> => {
    const response = await apiClient.get<PlanificacionResponseDTO>(`/planificaciones/${id}`);
    return response.data;
  },

  create: async (data: PlanificacionRequestDTO): Promise<PlanificacionResponseDTO> => {
    const response = await apiClient.post<PlanificacionResponseDTO>('/planificaciones', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/planificaciones/${id}`);
  },
};
