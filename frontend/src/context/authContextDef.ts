import { createContext } from 'react';
import type { LoginRequestDTO, RegistroRequestDTO, UsuarioResponseDTO } from '../types/usuario';

export interface AuthContextType {
  user: UsuarioResponseDTO | null;
  usuario: UsuarioResponseDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequestDTO) => Promise<void>;
  register: (data: RegistroRequestDTO) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
