import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UsuarioResponseDTO } from '../types/usuario';

// TODO: AUTH - Este es el contrato que se mantiene al implementar login real.
// Solo cambiará la implementación interna del Provider.
interface AuthContextType {
  usuario: UsuarioResponseDTO | null;
  setUsuario: (usuario: UsuarioResponseDTO | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
