import { apiClient } from '../../../shared/api/client';
import type { LoginRequestDTO, RegistroRequestDTO, UsuarioResponseDTO } from '../../usuarios/types/usuario';

export const authService = {
  login: async (credentials: LoginRequestDTO): Promise<UsuarioResponseDTO> => {
    const response = await apiClient.post<UsuarioResponseDTO>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegistroRequestDTO): Promise<UsuarioResponseDTO> => {
    const response = await apiClient.post<UsuarioResponseDTO>('/auth/registro', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<UsuarioResponseDTO> => {
    const response = await apiClient.get<UsuarioResponseDTO>('/auth/me');
    return response.data;
  },
};
