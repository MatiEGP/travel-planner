import { apiClient } from '../../../shared/api/client';
import type { UsuarioRequestDTO, UsuarioResponseDTO } from '../types/usuario';

export const usuarioService = {
    // Obtener todos los usuarios (GET /api/usuarios)
    getAll: async (options?: { signal?: AbortSignal }): Promise<UsuarioResponseDTO[]> => {
        const response = await apiClient.get<UsuarioResponseDTO[]>('/usuarios', options);
        return response.data;
    },

    // Crear un nuevo usuario (POST /api/usuarios)
    create: async (data: UsuarioRequestDTO, options?: { signal?: AbortSignal }): Promise<UsuarioResponseDTO> => {
        const response = await apiClient.post<UsuarioResponseDTO>('/usuarios', data, options);
        return response.data;
    }
};
