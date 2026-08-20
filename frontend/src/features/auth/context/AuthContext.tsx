import { useState, useEffect, type ReactNode, useCallback } from 'react';
import { AuthContext, type AuthContextType } from './authContextDef';
import type { LoginRequestDTO, RegistroRequestDTO, UsuarioResponseDTO } from '../../usuarios/types/usuario';
import { authService } from '../api/authService';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hidratar la sesión del usuario al montar el componente vía /api/auth/me
  useEffect(() => {
    let cancelled = false;

    const hydrateAuth = async () => {
      try {
        const currentUser = await authService.getMe();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    hydrateAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequestDTO) => {
    const loggedUser = await authService.login(credentials);
    setUser(loggedUser);
  }, []);

  const register = useCallback(async (data: RegistroRequestDTO) => {
    const registeredUser = await authService.register(data);
    setUser(registeredUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const hasRole = useCallback((role: string): boolean => {
    if (!user || !user.roles) return false;
    const normalizedRole = role.startsWith('ROLE_') ? role.substring(5) : role;
    return user.roles.some((r) => {
      const normalizedR = r.startsWith('ROLE_') ? r.substring(5) : r;
      return normalizedR.toUpperCase() === normalizedRole.toUpperCase();
    });
  }, [user]);

  const value: AuthContextType = {
    user,
    usuario: user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
