import { apiClient, setAccessToken } from '../../../shared/api/client';
import type { LoginRequestDTO, RegistroRequestDTO, UsuarioResponseDTO } from '../../usuarios/types/usuario';

export const authService = {
  login: async (credentials: LoginRequestDTO, options?: { signal?: AbortSignal }): Promise<UsuarioResponseDTO> => {
    const response = await apiClient.post<UsuarioResponseDTO>('/auth/login', credentials, options);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  register: async (data: RegistroRequestDTO, options?: { signal?: AbortSignal }): Promise<UsuarioResponseDTO> => {
    const response = await apiClient.post<UsuarioResponseDTO>('/auth/registro', data, options);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  logout: async (options?: { signal?: AbortSignal }): Promise<void> => {
    await apiClient.post('/auth/logout', undefined, options);
    setAccessToken(null);
  },

  getMe: async (options?: { signal?: AbortSignal }): Promise<UsuarioResponseDTO> => {
    const response = await apiClient.get<UsuarioResponseDTO>('/auth/me', options);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },
};
