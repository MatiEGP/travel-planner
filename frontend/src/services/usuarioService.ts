import { apiClient } from '../api/client';
import type { UsuarioRequestDTO, UsuarioResponseDTO } from '../types/usuario';

export const usuarioService = {
    // Obtener todos los usuarios (GET /api/usuarios)
    getAll: async (): Promise<UsuarioResponseDTO[]> => {
        const response = await apiClient.get<UsuarioResponseDTO[]>('/usuarios');
        return response.data;
    },

    // Crear un nuevo usuario (POST /api/usuarios)
    create: async (data: UsuarioRequestDTO): Promise<UsuarioResponseDTO> => {
        const response = await apiClient.post<UsuarioResponseDTO>('/usuarios', data);
        return response.data;
    }
};