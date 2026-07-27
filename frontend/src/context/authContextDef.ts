import { createContext } from 'react';
import type { UsuarioResponseDTO } from '../types/usuario';

// TODO: AUTH - Este es el contrato que se mantiene al implementar login real.
// Solo cambiará la implementación interna del Provider.
export interface AuthContextType {
  usuario: UsuarioResponseDTO | null;
  setUsuario: (usuario: UsuarioResponseDTO | null) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
