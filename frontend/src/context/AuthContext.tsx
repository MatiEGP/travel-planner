import { useState, type ReactNode } from 'react';
import { AuthContext } from './authContextDef';
import type { AuthContextType } from './authContextDef';
import type { UsuarioResponseDTO } from '../types/usuario';

// TODO: AUTH - Al implementar login, reemplazar la lógica interna de este Provider.
// En vez de permitir setUsuario manualmente, el usuario vendrá del resultado del login.
// El contrato (AuthContextType) se mantiene igual.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TODO: AUTH - Este estado manual se reemplazará por el estado del login
  const [usuario, setUsuario] = useState<UsuarioResponseDTO | null>(null);

  const value: AuthContextType = {
    usuario,
    setUsuario,
    isAuthenticated: usuario !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
